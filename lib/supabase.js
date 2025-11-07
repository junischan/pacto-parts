import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://pvwyjulitlzuceqqyfnb.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2d3lqdWxpdGx6dWNlcXF5Zm5iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1MjczMjksImV4cCI6MjA3NzEwMzMyOX0.EthsSooZrym38CZ9V3EVEe3YfYXTBS6GqA5ghwl2_gM'

export const supabase = createClient(supabaseUrl, supabaseKey)
