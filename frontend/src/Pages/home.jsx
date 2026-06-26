import { Link } from 'react-router-dom' ;


export default function Home() {
  return (
    <>
        <div className='bg-red-400 text-center'>Home</div>
        <div className='flex flex-col gap-2'>
            <Link to= '/login' >go to login</Link>
            <Link to= '/signup' >go to sign up</Link>
        </div>
        
    </>
  )
}
