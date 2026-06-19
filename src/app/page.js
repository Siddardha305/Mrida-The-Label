import { getSarees } from "./actions";
import DashboardClient from "../components/DashboardClient";

export const revalidate = 0; // Disable caching so it dynamic-renders current JSON state

export default async function Home() {
  const initialSarees = await getSarees();
  
  return <DashboardClient initialSarees={initialSarees} />;
}
