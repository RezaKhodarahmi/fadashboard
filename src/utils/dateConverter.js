import React from 'react'

function DateFormat({ date }) {
  // Function to add suffix to day
  function getSuffix(i) {
    let j = i % 10,
      k = i % 100
    if (j === 1 && k !== 11) {
      return i + 'st'
    }
    if (j === 2 && k !== 12) {
      return i + 'nd'
    }
    if (j === 3 && k !== 13) {
      return i + 'rd'
    }

    return i + 'th'
  }

  let dateObject = new Date(date)

  let monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]

  let day = getSuffix(dateObject.getUTCDate())
  let monthIndex = dateObject.getUTCMonth()
  let year = dateObject.getUTCFullYear()

  // construct your date string
  let dateString = `${monthNames[monthIndex]} ${day}, ${year}`

  return <span>{dateString}</span>
}

export default DateFormat
