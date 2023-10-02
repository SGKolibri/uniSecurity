import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Card from 'react-bootstrap/Card'
import base64 from "react-native-base64";
import Image from 'react-bootstrap/Image';

import useWindowDimensions from '../Utils/getWindowDimensions'

import Modal from '../Modal/modal-ocorrencia'
import Pagination from '../Pagination/pagination'

function Cards({ search }) {

    const { width, height } = useWindowDimensions();

    // console.log("WIDTH: ", width);
    // console.log("HEIGHT: ", height);

    /* Ocorrências */
    const [ocorrencias, setOcorrencias] = useState();
    const [numberOfOcorrencias, setNumberOfOcorrencias] = useState(0);

    /* Modal */
    const [modalOpen, setModalOpen] = useState(false);
    const open = () => setModalOpen(true);
    const close = () => setModalOpen(false);

    /* Páginas */
    const [curPage, setCurPage] = useState(1)
    const [cardsPerPage, setCardsPerPage] = useState(8)
    const lastCardIndex = curPage * cardsPerPage;
    const firstCardIndex = lastCardIndex - cardsPerPage;

    const defineCardsPerPage = () => {
        if (width < 576) {
            setCardsPerPage(1)
        } else if (width < 768) {
            setCardsPerPage(2)
        }
        else if (width < 992) {
            setCardsPerPage(4)
        }
        else if (width < 1200) {
            setCardsPerPage(6)
        }
        else {
            setCardsPerPage(8)
        }
    }

    useEffect(() => {
        defineCardsPerPage();
    }, [width]);

    useEffect(() => {
        fetch('http://localhost:3000/get-ocorrencia', {
            method: 'GET'
        })
            .then((response) => response.json())
            .then((data) => {
                setOcorrencias(data.ocorrencia);
                setNumberOfOcorrencias(data.ocorrencia.length);
            })
    }, []);

    function ConvertToImageFormat(base64ImageFormat, appTitle) {

        if (!base64ImageFormat) return (<h>Nenhuma imagem anexada.</h>);

        let url = base64ImageFormat;
        if (base64ImageFormat.indexOf("data:image/svg;base64,") > -1) {
            let decodedSvg = base64.decode(
                base64ImageFormat.replace("data:image/svg;base64,", "")
            );
            let blob = new Blob([decodedSvg], { type: "image/svg+xml" });
            url = URL.createObjectURL(blob);
        }
        return <Image src={url} alt={`${appTitle}`} style={{ width: "100%", height: "100%" }} />;
    }

    const displayCard = () => {
        let i = 0;

        let ocorrenciasArr = []
        let ocorrenciaNomesArr = []
        for (i = 0; i < numberOfOcorrencias; i++) {

            ocorrenciaNomesArr.push(ocorrencias[i].nome);
            ocorrenciasArr.push(
                <>
                    <Card.Title>{ocorrencias[i].nome}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">Categoria: {ocorrencias[i].categoria}</Card.Subtitle>
                    <Card.Text>
                        {ocorrencias && (
                            <div style={{ height: "75px" }}>
                                <h>Data e Hora: {ocorrencias[i].data} - {ocorrencias[i].hora}</h><br />
                                <h>Local: {ocorrencias[i].localizacao}</h>
                            </div>
                        )}
                        <div style={{ right: '25%' }}>
                            <Modal id={ocorrencias[i]._id} title={ocorrencias[i].nome} text={
                                <>
                                    <h>Categoria: {ocorrencias[i].categoria}</h> <br />
                                    <h>Data e Hora: {ocorrencias[i].data} - {ocorrencias[i].hora}</h><br />
                                    <h>Local: {ocorrencias[i].localizacao}</h><br />
                                    <h>{ocorrencias[i].descricao}</h><br />
                                    {ConvertToImageFormat(ocorrencias[i].image, ocorrencias[i].data)}
                                </>
                            }
                                ocorrenciaDetails={[ocorrencias[i].nome, ocorrencias[i].categoria, ocorrencias[i].data, ocorrencias[i].hora, ocorrencias[i].localizacao, ocorrencias[i].descricao]}
                            />
                        </div>
                    </Card.Text>

                </>
            )
        }

        const curCards = ocorrenciasArr.slice(firstCardIndex, lastCardIndex);

        return (
            <>

                {
                    search === "" ? curCards.map((ocorrencia) => {
                        return (
                            <motion.div
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.99 }}
                                style={{
                                    width: '18rem',
                                    display: "inline-block",
                                    margin: "1%",
                                    float: "left"
                                }}
                            >
                                <Card
                                    style={{
                                        position: "relative",
                                        maxHeight: "190px",
                                        minHeight: "190px",
                                        boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.2)"
                                    }}
                                >
                                    <Card.Body>
                                        {ocorrencia}
                                    </Card.Body>
                                </Card>
                            </motion.div >
                        )
                    })
                        :
                        ocorrenciasArr.filter((ocorrencia) => {
                            return ocorrencia.props.children[0].props.children.toLowerCase().includes(search.toLowerCase())
                        }).map((ocorrencia) => {
                            return (
                                <motion.div
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.99 }}
                                    style={{
                                        width: '18rem',
                                        display: "inline-block",
                                        margin: "1%",
                                        float: "left"
                                    }}
                                >
                                    <Card
                                        style={{
                                            position: "relative",
                                            maxHeight: "190px",
                                            minHeight: "190px",
                                            boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.2)"
                                        }}
                                    >
                                        <Card.Body>
                                            {ocorrencia}
                                        </Card.Body>
                                    </Card>
                                </motion.div >
                            )
                        })
                }

            </>
        )
    }

    return (
        <>
            <div
                style={{
                    marginLeft: "3.5%",
                    marginTop: "5%",
                    paddingLeft: "13px",
                    width: "92%",
                    height: "84%",
                    border: "1px solid #fff",
                    borderRadius: "10px",
                    boxShadow: "inset 0px 0px 5px 0px rgba(0,0,0,0.5)",
                    overflowY: "auto",
                    overflowX: "hidden",
                }}
                id="ocorrencia-wrapper"
                className="ocorrencia-wrapper"
            >

                {displayCard()}
            </div>
            <Pagination
                totalCards={numberOfOcorrencias}
                cardsPerPage={cardsPerPage}
                setCurPage={setCurPage}
                curPage={curPage}
            />
        </>
    );
}

export default Cards;