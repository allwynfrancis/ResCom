import React from 'react'

const JobInput = (props) => {
  const {job, changeJob} = props
  return (
    
      <textarea value={job} className='jdInput' onChange={(e) => changeJob(e.target.value)} placeholder="Paste Job Description"/>
    
  )
}

export default JobInput