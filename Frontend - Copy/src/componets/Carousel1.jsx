import React from 'react'
import { Carousel } from 'react-bootstrap'
import elec from '../assets/elec.png'
import mech from '../assets/mech.png'
import plumb from '../assets/plumb.png'
import carp from '../assets/carp.png'



const Carousel1 = () => {
  return (
    <div className='container-fluid p-0'>
          <Carousel className='w-100'>
            <Carousel.Item interval={1000}>
    
    
    
              <img
                className="d-block w-100"
                src={elec}
                alt="Electrical Services"
                style={{ height: '500px', objectFit: 'cover', objectPosition: 'top' }}
              />
             
            </Carousel.Item>
    
            <Carousel.Item interval={500}>
              <img
                className="d-block w-100"
                src={mech}
                alt="Mechanical Services"
                style={{ height: '500px', objectFit: 'cover', objectPosition: 'top' }}
              />
              
            </Carousel.Item>
    
            <Carousel.Item>
              <img
                className="d-block w-100"
                src={plumb}
                alt="Plumbing Services"
                style={{ height: '500px', objectFit: 'cover', objectPosition: 'top' }}
              />
              
            </Carousel.Item>
    
            <Carousel.Item>
              <img
                className="d-block w-100"
                src={carp}
                alt="Carpentry Services"
                style={{ height: '500px', objectFit: 'cover', objectPosition: 'top' }}
              />
              
            </Carousel.Item>
          </Carousel>
          {/* <div className='container pt-4'>
            <h1 className='text-center mb-4 fw-bold'>Hire Your Worker</h1>
            <div className='row justify-content-center'>
              {/* Worker Card 
              <div className='col-lg-3 col-md-4 col-sm-6 mb-4'>
                {/* <div className='card shadow-lg border-0 rounded-4 text-center p-3'>
                  <div className='card-body d-flex flex-column align-items-center'>
                    <img 
                      src="https://tse3.mm.bing.net/th?id=OIP.Xg-oollwht7fG2P6OPQgagHaHa&pid=Api&P=0&h=220" 
                      alt="Plumber" 
                      className='img-fluid rounded-circle' 
                      style={{ width: '120px', height: '120px', objectFit: 'cover' }} 
                    />
                    <h5 className='card-title pt-3 fw-semibold'>Plumber</h5>
                    <p className='card-text text-muted'>Expert in plumbing solutions</p>
                  </div>
                </div>
              </div> 
    
              
            </div>
              </div> */}
    
          </div>
  )
}

export default Carousel1