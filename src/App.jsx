import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import './App.css'
import Login from './login'
import Logout from './logout'

function App() {
  const [vehicles, setVehicles] = useState([])
  const [bookings, setBookings] = useState([])
  const [search, setSearch] = useState('')
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const [name, setName] = useState('')
  const [selectedVehicle, setSelectedVehicle] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  useEffect(() => {
    checkUser()
  }, [])

  async function checkUser() {
    const { data } = await supabase.auth.getUser()

    setUser(data.user)
    setLoading(false)

    if (data.user) {
      fetchVehicles()
      fetchBookings()
    }
  }

  async function fetchVehicles() {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')

    if (!error) {
      setVehicles(data)
    }
  }

  async function fetchBookings() {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')

    if (!error) {
      setBookings(data)
    }
  }

  async function bookVehicle(e) {
    e.preventDefault()

    if (new Date(endDate) <= new Date(startDate)) {
      alert('End date must be after start date!')
      return
    }

    const vehicle = vehicles.find(
      (v) => v.id === Number(selectedVehicle)
    )

    const start = new Date(startDate)
    const end = new Date(endDate)

    const days = Math.ceil(
      (end - start) / (1000 * 60 * 60 * 24)
    )

    const total = days * vehicle.price_per_day

    const { error } = await supabase
      .from('bookings')
      .insert([{
        customer_name: name,
        vehicle_id: selectedVehicle,
        start_date: startDate,
        end_date: endDate
      }])

    if (error) {
      alert(error.message)
    } else {
      alert(`Vehicle booked successfully! Total: ₹${total}`)

      setName('')
      setSelectedVehicle('')
      setStartDate('')
      setEndDate('')

      fetchBookings()
    }
  }

  async function cancelBooking(id) {
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id)

    if (error) {
      alert(error.message)
    } else {
      alert('Booking cancelled!')
      fetchBookings()
    }
  }

  function getVehicleName(vehicleId) {
    const vehicle = vehicles.find(
      (vehicle) => vehicle.id === vehicleId
    )

    return vehicle ? vehicle.name : 'Unknown Vehicle'
  }

  const path = window.location.pathname

  if (path === '/login') {
    return <Login />
  }

  if (path === '/logout') {
    return <Logout />
  }

  if (loading) {
    return <p>Loading...</p>
  }

  if (!user) {
    return <Login />
  }

  return (
    <div>
      <h1>Vehicle Rental System</h1>

      <p>
        Logged in as: <strong>{user.email}</strong>
      </p>

      <p>
        <a href="/logout">Logout</a>
      </p>

      <h2>Dashboard</h2>

      <p>
        Total Vehicles: <strong>{vehicles.length}</strong>
      </p>

      <p>
        Total Bookings: <strong>{bookings.length}</strong>
      </p>

      <h2>Available Vehicles</h2>

      <p>Search and select a vehicle for your rental.</p>

      <input
        type="text"
        placeholder="Search vehicle..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {vehicles
        .filter((vehicle) =>
          vehicle.name.toLowerCase().includes(search.toLowerCase())
        )
        .map((vehicle) => (
          <div key={vehicle.id}>
            <h3>{vehicle.name}</h3>
            <p>{vehicle.type}</p>
            <p>₹{vehicle.price_per_day} / day</p>
            <p>
              {vehicle.available ? 'Available' : 'Not Available'}
            </p>
          </div>
        ))}

      <h2>Book a Vehicle</h2>

      <form onSubmit={bookVehicle}>
        <input
          type="text"
          placeholder="Customer Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <select
          value={selectedVehicle}
          onChange={(e) => setSelectedVehicle(e.target.value)}
          required
        >
          <option value="">Select Vehicle</option>

          {vehicles.map((vehicle) => (
            <option key={vehicle.id} value={vehicle.id}>
              {vehicle.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />

        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />

        <button type="submit">Book Vehicle</button>
      </form>

      <h2>Booking History</h2>

      {bookings.map((booking) => (
        <div key={booking.id}>
          <p>
            <strong>Customer:</strong> {booking.customer_name}
          </p>

          <p>
            <strong>Vehicle:</strong>{' '}
            {getVehicleName(booking.vehicle_id)}
          </p>

          <p>
            <strong>From:</strong> {booking.start_date}
          </p>

          <p>
            <strong>To:</strong> {booking.end_date}
          </p>

          <button onClick={() => cancelBooking(booking.id)}>
            Cancel Booking
          </button>
        </div>
      ))}
    </div>
  )
}

export default App