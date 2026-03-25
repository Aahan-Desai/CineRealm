async function main() {
  try {
    const res = await fetch('http://localhost:5000/users/tony')
    const json = await res.json()
    console.log('Status Code:', res.status)
    console.log('API Response:', json)
  } catch (err) {
    if (err instanceof Error) {
      console.error('Fetch error:', err.message)
    } else {
      console.error('Fetch error:', String(err))
    }
  }
}

main()
