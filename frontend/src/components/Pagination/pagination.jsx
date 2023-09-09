import React from 'react'
import { Button, ButtonGroup } from "@nextui-org/react";
import { motion } from 'framer-motion'

const Pagination = ({ totalCards, cardsPerPage, setCurPage, curPage }) => {

    let pages = [];

    for (let i = 1; i <= Math.ceil(totalCards / cardsPerPage); i++) {
        pages.push(i);
    }

    return (
        <ButtonGroup>
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                    height: "100%",
                    justifyContent: "center"
                }}
                className="pagination"
            >

                {
                    //for each element in pages, create a button
                    pages.map((page) => (
                        <motion.button
                            style={{
                                width: "40px",
                                color: page === curPage ? "white" : "black",
                                backgroundColor: page === curPage ? "#0850BC" : "white",
                                borderTopLeftRadius: page === 1 ? "5px" : "0px",
                                borderBottomLeftRadius: page === 1 ? "5px" : "0px",
                                borderTopRightRadius: page === pages.length ? "5px" : "0px",
                                borderBottomRightRadius: page === pages.length ? "5px" : "0px",
                                border: "1px solid #0850BC",
                            }}
                            key={page}
                            onClick={() => setCurPage(page)}
                            auto
                        >
                            {page}
                        </motion.button>
                    ))
                }
            </ div >
        </ButtonGroup>
    )
}

export default Pagination