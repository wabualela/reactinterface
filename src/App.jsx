import { useCallback, useEffect, useState } from 'react'
import { BiCalendar } from 'react-icons/bi'
import AddAppointment from './components/AddAppointment'
import Appointmentinfo from './components/AppointmentInfo'
import Search from './components/search'

function App() {

	let [appointmentList, setAppointmentList] = useState([]);
	const [query, setQuery] = useState('')
	const [orderBy, setOrderBy] = useState('asc')
	const [sortBy, setSortBy] = useState('petName')

	const filteredAppointments = appointmentList.filter(
		appointment => {
			return appointment.petName.toLowerCase().includes(query.toLowerCase()) ||
				appointment.ownerName.toLowerCase().includes(query.toLowerCase()) ||
				appointment.aptNotes.toLowerCase().includes(query.toLowerCase())
		}
	).sort((a, b) => {
		let orderDirection = (orderBy === 'asc') ? 1 : -1
		return (
			a[sortBy].toLowerCase() < b[sortBy].toLowerCase()
				? -1 * orderDirection : 1 * orderDirection
		)
	})

	const fetchData = useCallback(() => {
		fetch('./data.json')
			.then(response => response.json())
			.then(data => { setAppointmentList(data) });
	}, [])

	useEffect(() => {
		fetchData()
	}, [fetchData]);

	return (
		<div className="container mx-auto mt-3 font-thin">
			<h1 className="text-5xl mb-3">
				<BiCalendar className='inline-block text-red-400 align-top' /> Your Appointments
			</h1>
			<AddAppointment
				onSendAppointment={myAppointment => setAppointmentList([...appointmentList, myAppointment])}
				lastId={appointmentList.reduce((max, appointment) => Number(appointment.id) > max ? Number(appointment.id) : max, 0)}
			/>
			<Search
				query={query}
				onQueryChange={myQuery => setQuery(myQuery)}
				sortBy={sortBy}
				onSortByChange={mySort => setSortBy(mySort)}
				orderBy={orderBy}
				onOrderByChange={mySort => setOrderBy(mySort)}
			/>

			<ul className="divide-y divide-gray-200">
				{filteredAppointments.map(appointment => (
					<Appointmentinfo
						key={appointment.id}
						appointment={appointment}
						onDeleteAppointment={
							appointmentId => setAppointmentList(appointmentList.filter(appointment => appointment.id !== appointmentId))
						}
					/>
				))}
			</ul>
		</div>
	)
}

export default App
