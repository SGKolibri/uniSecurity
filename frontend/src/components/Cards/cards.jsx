import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Card from 'react-bootstrap/Card'
import base64 from "react-native-base64";
import Image from 'react-bootstrap/Image';
import { Spinner } from '@chakra-ui/react'

import useWindowDimensions from '../Utils/getWindowDimensions'

import Modal from '../Modal/modal-ocorrencia'
import Pagination from '../Pagination/pagination'

function Cards({ search }) {

    let ROUTE = process.env.REACT_APP_BACKEND_ROUTE || process.env.REACT_APP_VERCEL_ROUTE;

    /* Get Window Width Dimension */
    const { width } = useWindowDimensions();

    /* Loading */
    const [loading, setLoading] = useState(true);

    /* Pinned */
    const [pinned, setPinned] = useState(false);
    const pin = () => setPinned(true);
    const unpin = () => setPinned(false);

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

    useEffect(() => {
        fetch(ROUTE + 'get-ocorrencia', {
            method: 'GET'
        })
            .then((response) => response.json())
            .then((data) => {
                setOcorrencias(data.ocorrencia);
                setNumberOfOcorrencias(data.ocorrencia.length);
            })
            .then(() => {
                setLoading(false);
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

    useEffect(() => {
        if (width > 992) {
            setCardsPerPage(8);
        } else {
            setCardsPerPage(8);
        }
    }, [width]);

    const sliceNameAtBlankSpace = (name) => {
        let nameArr = name.split(" ");
        let firstName = nameArr[0];
        if (nameArr[1] === undefined) return firstName;
        let lastName = nameArr[1];
        return firstName + " " + lastName + "...";
    }

    const displayCard = () => {
        let i = 0;
        let curCards = [];
        let ocorrenciasArr = [];
        let ocorrenciaNomesArr = [];

        if (width > 992) {

            for (i = 0; i < numberOfOcorrencias; i++) {
                // Desktop View
                ocorrenciaNomesArr.push(ocorrencias[i].nome);
                ocorrenciasArr.push(
                    <>
                        <Card.Title
                            style={{
                                display: "flex",
                                borderTopLeftRadius: "100px",
                            }}
                        >
                            {ocorrencias[i].nome}

                        </Card.Title >
                        <Card.Subtitle className="mb-2 text-muted">Categoria: {ocorrencias[i].categoria}</Card.Subtitle>
                        <Card.Text
                            style={{ textOverflow: "ellipsis" }}
                        >

                            {ocorrencias && (
                                <div style={{ height: "75px" }}>
                                    <h>Data e Hora: {ocorrencias[i].data} - {ocorrencias[i].hora}</h><br />
                                    <h>Local: {ocorrencias[i].localizacao}</h>
                                </div>
                            )}
                            <div style={{ right: '25%' }}>
                                <Modal centered id={ocorrencias[i]._id} title={ocorrencias[i].nome} text={
                                    <>
                                        {width > 992 ? (<></>) : (<></>)}
                                        <h>Categoria: {ocorrencias[i].categoria}</h> <br />
                                        <h>Data e Hora: {ocorrencias[i].data} - {ocorrencias[i].hora}</h><br />
                                        <h>Local: {ocorrencias[i].localizacao}</h><br />
                                        <h>{ocorrencias[i].descricao}</h><br />
                                        {ConvertToImageFormat(ocorrencias[i].image, ocorrencias[i].data)}
                                    </>
                                }
                                    ocorrenciaDetails={
                                        {
                                            nome: ocorrencias[i].nome,
                                            categoria: ocorrencias[i].categoria,
                                            data: ocorrencias[i].data,
                                            hora: ocorrencias[i].hora,
                                            localizacao: ocorrencias[i].localizacao,
                                            descricao: ocorrencias[i].descricao,
                                            image: ocorrencias[i].image
                                        }
                                    }
                                />
                            </div>
                        </Card.Text>

                    </>
                )
            }
            curCards = ocorrenciasArr.slice(firstCardIndex, lastCardIndex);

        } else {
            // Mobile View
            for (i = 0; i < numberOfOcorrencias; i++) {

                ocorrenciaNomesArr.push(ocorrencias[i].nome);
                ocorrenciasArr.push(
                    <>
                        <Card.Title>
                            {sliceNameAtBlankSpace(ocorrencias[i].nome)}
                        </Card.Title >

                        {width > 992 ? (<Card.Subtitle className="mb-2 text-muted">Categoria: {ocorrencias[i].categoria}</Card.Subtitle>)
                            :
                            (<Card.Subtitle className="mb-2 text-muted">{ocorrencias[i].categoria}</Card.Subtitle>)}

                        <hr />

                        <Card.Text>
                            {ocorrencias && (
                                <div style={{ height: "75px" }}>
                                    {width > 992 ? (<><h>Data e Hora: {ocorrencias[i].data} - {ocorrencias[i].hora}</h><br /></>) : (<></>)}
                                    {width > 992 ? (<><h>Local: {ocorrencias[i].localizacao}</h><br /></>) : (<></>)}
                                </div>
                            )}
                            <div>
                                <Modal id={ocorrencias[i]._id} title={ocorrencias[i].nome} text={
                                    <>
                                        <h>Categoria: {ocorrencias[i].categoria}</h> <br />
                                        <h>Data e Hora: {ocorrencias[i].data} - {ocorrencias[i].hora}</h><br />
                                        <h>Local: {ocorrencias[i].localizacao}</h><br />
                                        <h>{ocorrencias[i].descricao}</h><br />
                                        {ConvertToImageFormat(ocorrencias[i].image, ocorrencias[i].data)}
                                    </>
                                }
                                    ocorrenciaDetails={
                                        {
                                            nome: ocorrencias[i].nome,
                                            categoria: ocorrencias[i].categoria,
                                            data: ocorrencias[i].data,
                                            hora: ocorrencias[i].hora,
                                            localizacao: ocorrencias[i].localizacao,
                                            descricao: ocorrencias[i].descricao,
                                            image: ocorrencias[i].image
                                        }
                                    }
                                />

                            </div>
                        </Card.Text>

                    </>
                )
            }
            curCards = ocorrenciasArr.slice(firstCardIndex, lastCardIndex);
        }

        return (
            <>
                {search === "" ? curCards.map((ocorrencia) => {
                    return (
                        <motion.div
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.99 }}
                            style={{
                                width: `${width > 992 ? "18rem" : "8.5rem"}`,
                                display: "inline-block",
                                margin: "1%",
                            }}
                        >
                            <Card
                                style={{
                                    position: "relative",
                                    maxHeight: `${width > 992 ? "190px" : "140px"}`,
                                    minHeight: `${width > 992 ? "190px" : "140px"}`,
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
                    // Search
                    ocorrenciasArr.filter((ocorrencia) => {
                        console.log(ocorrencia.props.children[0].props.children)
                        return ocorrencia.props.children[0].props.children.toLowerCase().includes(search.toLowerCase())
                    }).map((ocorrencia) => {
                        return (
                            <motion.div
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.99 }}
                                style={{
                                    width: `${width > 992 ? "18rem" : "8.5rem"}`,
                                    display: "inline-block",
                                    margin: "1%",
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
            {width > 992 ?
                (
                    // Desktop View
                    <>
                        <div
                            style={{
                                marginLeft: "3.5%",
                                paddingTop: "0.5%",
                                width: "92%",
                                height: "84%",
                                border: "1px solid #fff",
                                borderRadius: "10px",
                                boxShadow: "inset 0px 0px 5px 0px rgba(0,0,0,0.5)",
                                overflowY: "auto",
                                overflowX: "hidden",
                                position: "relative",
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fit, minmax(18rem, 1fr))",
                                placeItems: "center"
                            }}
                            id="ocorrencia-wrapper"
                            className="ocorrencia-wrapper"
                        >
                            {loading === true ? <Spinner /> : displayCard()}
                        </div>
                        <Pagination
                            totalCards={numberOfOcorrencias}
                            cardsPerPage={cardsPerPage}
                            setCurPage={setCurPage}
                            curPage={curPage}
                        />
                    </>
                ) : (
                    // Mobile View
                    <>
                        <div
                            style={{
                                marginTop: "3%",
                                paddingTop: "2%",
                                paddingRight: "5%",
                                paddingLeft: "5.5%",
                                width: "100%",
                                height: "75%",
                                borderRadius: "10px",
                                boxShadow: "inset 0px 0px 5px 0px rgba(0,0,0,0.5)",
                                overflowY: "auto",
                                overflowX: "hidden",
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fit, minmax(8.5rem, 1fr))",
                                placeItems: "center",
                            }}
                            id="ocorrencia-wrapper"
                            className="ocorrencia-wrapper"
                        >
                            {loading === true ? <Spinner /> : displayCard()}
                        </div>
                        <Pagination
                            totalCards={numberOfOcorrencias}
                            cardsPerPage={cardsPerPage}
                            setCurPage={setCurPage}
                            curPage={curPage}
                        />
                    </>
                )}

        </>
    );
}

export default Cards;