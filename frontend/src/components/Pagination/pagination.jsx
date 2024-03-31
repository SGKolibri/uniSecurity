import { motion } from 'framer-motion';
import { MdKeyboardArrowRight } from "react-icons/md";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { Spinner } from '@chakra-ui/react';

export default function PaginationComponent({ curPage, setCurPage, cardsPerPage, numberOfOcorrencias, loading }) {

    const active = 'bg-[#00151F] text-white py-2 px-[12px] md:px-4 h-full'
    const inactive = 'bg-white text-[#00151F] py-2 px-[12px] md:px-4 h-full'

    const totalPages = Math.ceil(numberOfOcorrencias / cardsPerPage);

    let startPage, endPage;
    const maxPagesToShow = window.innerWidth < 768 ? 4 : 5;
    if (totalPages <= maxPagesToShow) {
        startPage = 1;
        endPage = totalPages;
    } else {
        if (curPage <= 2) {
            startPage = 1;
            endPage = maxPagesToShow;
        } else if (curPage + 2 >= totalPages) {
            startPage = totalPages - (maxPagesToShow - 1);
            endPage = totalPages;
        } else {
            startPage = curPage - 2;
            endPage = curPage + 2;
        }
    }
    const pageNumbers = Array.from({ length: (endPage - startPage + 1) }, (_, i) => startPage + i);

    return (
        <>
            <div className='bg-white w-[95%] md:w-2/5 flex px-2 gap-2 rounded-lg text-[#00151F] border-[#00151F] border-1 justify-center items-center' style={{ boxShadow: '0px 3px 3px rgba(0, 0, 0, 0.25)' }}>
                {loading ?
                    <div>
                        <Spinner />
                    </ div>
                    :
                    <>
                        <div className='flex mr-auto'>
                            <motion.button onClick={() => { if (curPage > 1) { setCurPage(curPage - 1) } }} disabled={curPage === 1}>
                                <div className='flex py-2 items-center justify-center cursor-pointer'>
                                    <MdKeyboardArrowLeft className='w-6 h-6 ' />
                                    <label className='hidden md:block cursor-pointer'>
                                        Anterior
                                    </label>
                                </div>
                            </motion.button>
                            <div className='border ml-1 md:ml-2 my-1' />
                        </div>
                        <div>
                            {totalPages > 4 && totalPages !== 5 && curPage > 3 &&
                                <>
                                    <motion.button className={curPage === 1 ? active : inactive} onClick={() => setCurPage(1)}>
                                        {1}
                                    </motion.button>
                                    <span>...</span>
                                </>
                            }

                            {pageNumbers.map((number) => (
                                <motion.button className={curPage === number ? active : inactive} key={number} onClick={() => setCurPage(number)}  >
                                    {number}
                                </motion.button>
                            ))}

                            {totalPages > 4 && totalPages !== 5 && curPage < totalPages - 2 &&
                                <>
                                    <span>...</span>
                                    <motion.button className={curPage === totalPages ? active : inactive} onClick={() => setCurPage(totalPages)}>
                                        {totalPages}
                                    </motion.button>
                                </>
                            }
                        </div>
                        <div className='flex ml-auto'>
                            <div className='border mr-1 md:mr-2 my-1' />
                            <motion.button onClick={() => { if (curPage < Math.ceil(numberOfOcorrencias / cardsPerPage)) { setCurPage(curPage + 1) } }} disabled={curPage === Math.ceil(numberOfOcorrencias / cardsPerPage)}>
                                <div className='flex py-2 items-center justify-center cursor-pointer'>
                                    <label className='hidden md:block cursor-pointer'>
                                        Próximo
                                    </label>
                                    <MdKeyboardArrowRight className='w-6 h-6' />
                                </div>
                            </motion.button>
                        </div>
                    </>
                }
            </div>
        </>
    );
}
