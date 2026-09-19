import { supabase } from './supabase'

export async function testSupabaseConnection() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .limit(5)

  if (error) {
    console.error('Supabase connection error:', error)
    return
  }

  console.log('Supabase connection successful!')
  console.log('Products:', data)
}