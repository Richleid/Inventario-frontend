import React from 'react'
import ReactPaginate from 'react-paginate'
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs'

const PaginationButtons = ({ itemsPerPage, onPageChange }) => {
  return (
    <div>
      <ReactPaginate
        breakLabel="..."
        nextLabel={
          <span className='w-5 h-5 flex items-center justify-center bg-white rounded-md mr-1 ml-1'>
            <BsChevronRight/>
          </span>
        }
        onPageChange={onPageChange}
        pageRangeDisplayed={1}
        pageCount={itemsPerPage}
        previousLabel={
          <span className='w-5 h-5 flex items-center justify-center bg-white rounded-md mr-1 ml-1'>
            <BsChevronLeft/>
          </span>
        }
        pageClassName='block border border-solid border-white rounded-md bg-white w-5 h-5 
        hover:bg-blue-500 mr-1 ml-1 flex items-center justify-center'
        renderOnZeroPageCount={null}
        containerClassName='flex flex-row items-center justify-center mt-0'
        activeClassName='border-4 border-solid border-blue-500'
      />

    </div>
  )
}

export default PaginationButtons