import React from 'react'

const Logo = ({h,w}:{
  h?:number,
  w?:number
}) => {
  return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={` ${h ? "h-" + h : "h-28"} ${w ? "w-" + w : "w-28"} text-primary animate-pulse`}
          data-ai-hint="connectivity logo"
        >
          <path d="M10.62 3.513A7.913 7.913 0 0 0 4.3 8.051" />
          <path d="M13.38 20.487a7.913 7.913 0 0 0 6.291-4.538" />
          <path d="M3.513 13.38A7.913 7.913 0 0 0 8.051 19.7" />
          <path d="M20.487 10.62A7.913 7.913 0 0 0 15.949 4.3" />
          <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
          <path d="M12 12a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z" />
          <path d="M12 12a4 4 0 1 0-8 0 4 4 0 0 0 8 0Z" />
          <path d="M12 12a4 4 0 1 0 8 0 4 4 0 0 0-8 0Z" />
        </svg>
  )
}

export default Logo