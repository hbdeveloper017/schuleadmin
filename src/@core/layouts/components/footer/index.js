// ** Icons Import
import { Heart } from 'react-feather'

const Footer = () => {
  return (
    <p className='clearfix mb-0'>
      <span className='d-block d-block mt-25 text-center'>
        COPYRIGHT © {new Date().getFullYear()}{' '}
        <a href='' target='_blank' rel='noopener noreferrer'>
        Schule im Griff
        </a>. All rights Reserved
      </span>
    </p>
  )
}

export default Footer
