import { supabase } from './supabase'

function Logout() {
  async function handleLogout() {
    const { error } = await supabase.auth.signOut()

    if (error) {
      alert(error.message)
    } else {
      alert('Logged out successfully!')
      window.location.href = '/login'
    }
  }

  return (
    <div>
      <h1>Logout</h1>

      <p>Are you sure you want to logout?</p>

      <button onClick={handleLogout}>Logout</button>

      <p>
        <a href="/">Back to Home</a>
      </p>
    </div>
  )
}

export default Logout