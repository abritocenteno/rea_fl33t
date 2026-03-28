import { supabase } from '@/lib/supabase'
import { AutoDetails } from '@/lib/types'
import FleetDashboard from '@/components/FleetDashboard'

async function getVehicles(): Promise<AutoDetails[]> {
  const { data } = await supabase
    .from('auto_details')
    .select('*')
    .order('created_at', { ascending: false })
  return data ?? []
}

export default async function HomePage() {
  const vehicles = await getVehicles()
  return <FleetDashboard vehicles={vehicles} />
}
