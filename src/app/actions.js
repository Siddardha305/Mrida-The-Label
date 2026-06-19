"use server";

import fs from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';
import clientPromise from '../lib/mongodb';

const filePath = path.join(process.cwd(), 'src', 'data', 'sarees.json');

// Helper to get collection
async function getCollection() {
  const client = await clientPromise;
  const db = client.db('mrida_db');
  return db.collection('sarees');
}

// Get all sarees with auto-migration from local JSON
export async function getSarees() {
  try {
    const client = await clientPromise;
    const db = client.db('mrida_db');
    const collection = db.collection('sarees');
    const settingsCollection = db.collection('settings');
    
    // Auto-migration check (Only runs if the database settings indicates it has never seeded)
    const seedStatus = await settingsCollection.findOne({ key: "seeded" });
    if (!seedStatus) {
      const count = await collection.countDocuments();
      if (count === 0) {
        console.log("MongoDB collection is empty and has not been seeded. Seeding from sarees.json...");
        try {
          const localData = await fs.readFile(filePath, 'utf-8');
          const initialSarees = JSON.parse(localData);
          if (initialSarees.length > 0) {
            const bulkOps = initialSarees.map(saree => ({
              updateOne: {
                filter: { id: saree.id },
                update: { $setOnInsert: saree },
                upsert: true
              }
            }));
            await collection.bulkWrite(bulkOps);
            console.log(`Successfully seeded ${initialSarees.length} sarees into MongoDB Atlas.`);
          }
        } catch (seedErr) {
          console.error("Auto-seeding sarees into MongoDB failed:", seedErr);
        }
      }
      
      // Mark as seeded so that even if the user deletes all sarees later, it does not re-seed automatically
      await settingsCollection.updateOne(
        { key: "seeded" },
        { $set: { value: true } },
        { upsert: true }
      );
    }
    
    // Deduplication step to clean up any duplicate documents in the database
    const allDocs = await collection.find({}).toArray();
    const seenIds = new Set();
    const duplicateObjectIds = [];
    
    for (const doc of allDocs) {
      if (seenIds.has(doc.id)) {
        duplicateObjectIds.push(doc._id);
      } else {
        seenIds.add(doc.id);
      }
    }
    
    if (duplicateObjectIds.length > 0) {
      console.log(`Deduplication: Removing ${duplicateObjectIds.length} duplicate documents from MongoDB...`);
      await collection.deleteMany({ _id: { $in: duplicateObjectIds } });
    }
    
    // Retrieve all sarees from Atlas
    const mongoSarees = await collection.find({}).toArray();
    
    // Map _id to preserve normal client-side operations
    return mongoSarees.map(item => {
      const { _id, ...saree } = item;
      return saree;
    });
  } catch (error) {
    console.error("Error reading sarees data from MongoDB Atlas:", error);
    return [];
  }
}

// Add new Saree
export async function addSaree(sareeData) {
  try {
    const collection = await getCollection();
    
    const newSaree = {
      id: `saree-${Date.now()}`,
      code: sareeData.code || `MTL-${Date.now().toString().slice(-4)}`,
      name: sareeData.name || "Unnamed Saree",
      price: Number(sareeData.price) || 0,
      status: sareeData.status || "available",
      fabric: sareeData.fabric || "Unknown",
      color: sareeData.color || "Unknown",
      instagramUrl: sareeData.instagramUrl || "",
      imageUrl: sareeData.imageUrl || "/images/placeholder.jpg",
      description: sareeData.description || "",
      message: sareeData.message || "",
      lastUpdated: new Date().toISOString()
    };

    await collection.insertOne(newSaree);
    const { _id, ...cleanNewSaree } = newSaree;
    revalidatePath('/');
    return { success: true, saree: cleanNewSaree };
  } catch (error) {
    console.error("Error adding saree to MongoDB Atlas:", error);
    return { success: false, error: "Failed to add saree: " + error.message };
  }
}

// Update Saree fields
export async function updateSaree(id, updatedFields) {
  try {
    const collection = await getCollection();
    
    const updatePayload = {
      ...updatedFields,
      price: Number(updatedFields.price),
      lastUpdated: new Date().toISOString()
    };
    
    // Prevent overriding unique identifiers
    delete updatePayload.id;
    delete updatePayload._id;

    await collection.updateOne(
      { id: id },
      { $set: updatePayload }
    );
    
    const updatedSaree = await collection.findOne({ id: id });
    const { _id, ...cleanSaree } = updatedSaree;
    
    revalidatePath('/');
    return { success: true, saree: cleanSaree };
  } catch (error) {
    console.error("Error updating saree on MongoDB Atlas:", error);
    return { success: false, error: "Failed to update saree: " + error.message };
  }
}

// Toggle status quickly
export async function toggleSareeStatus(id) {
  try {
    const collection = await getCollection();
    const saree = await collection.findOne({ id: id });
    
    if (!saree) {
      return { success: false, error: "Saree not found" };
    }

    const currentStatus = saree.status;
    let nextStatus = "available";
    if (currentStatus === "available") {
      nextStatus = "out_of_stock";
    } else if (currentStatus === "out_of_stock") {
      nextStatus = "pre_order";
    } else {
      nextStatus = "available";
    }

    await collection.updateOne(
      { id: id },
      { 
        $set: { 
          status: nextStatus,
          lastUpdated: new Date().toISOString() 
        } 
      }
    );
    
    revalidatePath('/');
    return { success: true, status: nextStatus };
  } catch (error) {
    console.error("Error toggling status on MongoDB Atlas:", error);
    return { success: false, error: "Failed to toggle status: " + error.message };
  }
}

// Delete Saree
export async function deleteSaree(id) {
  try {
    const collection = await getCollection();
    const result = await collection.deleteOne({ id: id });
    
    if (result.deletedCount === 0) {
      return { success: false, error: "Saree not found" };
    }

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error("Error deleting saree from MongoDB Atlas:", error);
    return { success: false, error: "Failed to delete: " + error.message };
  }
}
