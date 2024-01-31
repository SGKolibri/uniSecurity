import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Card from 'react-bootstrap/Card'
import base64 from "react-native-base64";
import Image from 'react-bootstrap/Image';
import { Input, Spinner } from '@chakra-ui/react'
import useWindowDimensions from '../Utils/getWindowDimensions'
import Modal from './modal-ocorrencia'
import { useContext } from 'react';
import { FilterContext } from '../Context/filter-context';
import axios from 'axios';


function Cards({ search, curPage, setCurPage, cardsPerPage }) {

    const backendURL = process.env.REACT_APP_BACKEND_URL;
    const filterContext = useContext(FilterContext);
    const { width } = useWindowDimensions();

    const [loading, setLoading] = useState(true);
    const [ocorrencias, setOcorrencias] = useState();
    const [inputTimeout, setInputTimeout] = useState(null);

    const totalPages = Math.ceil(FilterContext.numberOfOcorrencias / cardsPerPage);

    const mobile = width < 992;

    useEffect(() => {
        let currentPage = search === "" ? curPage : 1;
        setCurPage(currentPage);

        let query = `?page=${currentPage - 1}&limit=${cardsPerPage}`;
        query += search === "" ? "" : `&search=${search}`;
        query += filterContext.categoria === "" ? "" : `&categoria=${filterContext.categoria}`;
        query += filterContext.local === "" ? "" : `&localizacao=${filterContext.local}`;
        query += filterContext.registeredBy === "" ? "" : `&registeredBy=${filterContext.registeredBy}`;
        query += filterContext.data === "" ? "" : `&sortOrder=${filterContext.data}`;

        axios.get(`${backendURL}/get-ocorrencia${query}`)
            .then((response) => {
                setOcorrencias(response.data.ocorrencia);
            })
            .then(() => {
                setLoading(false);
            })
    }, [filterContext.categoria, filterContext.local, filterContext.registeredBy, filterContext.data, filterContext.hasFilters, curPage, search, backendURL, filterContext.numberOfOcorrencias, setCurPage, cardsPerPage]);

    function ConvertToImageFormat(base64ImageFormat, appTitle) {
        if (!base64ImageFormat) return (<h>Nenhuma imagem anexada.</h>);
        let url = base64ImageFormat;
        if (base64ImageFormat.indexOf("data:image/svg;base64,") > -1) {
            let decodedSvg = base64.decode(base64ImageFormat.replace("data:image/svg;base64,", ""));
            let blob = new Blob([decodedSvg], { type: "image/svg+xml" });
            url = URL.createObjectURL(blob);
        }
        return <Image src={url} alt={`${appTitle}`} style={{ width: "100%", height: "100%" }} />;
    }

    const sliceNameAtBlankSpace = (name) => {
        let nameArr = name.split(" ");
        let firstName = nameArr[0];
        if (nameArr[1] === undefined) return firstName;
        let lastName = nameArr[1];
        return firstName + " " + lastName + "...";
    }

    let cardsToFilter = [];
    const displayCard = () => {
        let i = 0;
        let curCards = [];

        if (ocorrencias === undefined || ocorrencias.length === 0) {
            return (
                <div style={{ textAlign: "center", margin: "5%" }}>
                    <h>Nenhuma ocorrência registrada.</h>
                </div>
            )
        }

        if (width > 992) {
            for (i = 0; i < ocorrencias.length; i++) {
                cardsToFilter.push(
                    <>
                        <Card.Title
                            style={{
                                display: "flex",
                                borderTopLeftRadius: "100px",
                            }}
                        >
                            {ocorrencias[i].nome}

                        </Card.Title >
                        <Card.Subtitle className="mb-2 text-muted">
                            Categoria: {ocorrencias[i].categoria}
                            <br />
                            Registrador por: {ocorrencias[i].registeredBy}
                        </Card.Subtitle>
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
                                        <h>Registrado por: {ocorrencias[i].registeredBy}</h> <br />
                                        <div style={{ marginTop: "2%", marginBottom: "3%" }}>
                                            <h >{ocorrencias[i].descricao}</h><br />
                                        </div>
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
                                            image: ocorrencias[i].image,
                                            registeredBy: ocorrencias[i].registeredBy
                                        }
                                    }
                                />
                            </div>
                        </Card.Text>
                    </>
                )
            }

            let filteredOcorrencias = cardsToFilter;

            if (filteredOcorrencias === undefined || filteredOcorrencias.length === 0) {
                return (
                    <div style={{ textAlign: "center", margin: "5%" }}>
                        <h>Nenhuma ocorrência encontrada. Filtros aplicados:</h> < br />
                        {/* {filterContext.categoria === "" ? (<></>) : (<><h>Categoria: {filterContext.categoria}</h> < br /></>)}
                        {filterContext.local === "" ? (<></>) : (<><h>Local: {filterContext.local}</h> <br /> </>)}
                        {filterContext.registeredBy === "" ? (<></>) : (<h>Registrador: {filterContext.registeredBy}</h>)} */}
                    </div >
                )
            }
            curCards = filteredOcorrencias;

        } else {
            for (i = 0; i < ocorrencias.length; i++) {

                cardsToFilter.push(
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
                                <Modal centered id={ocorrencias[i]._id} title={ocorrencias[i].nome} text={
                                    <>
                                        {width > 992 ? (<></>) : (<></>)}
                                        <h>Categoria: {ocorrencias[i].categoria}</h> <br />
                                        <h>Data e Hora: {ocorrencias[i].data} - {ocorrencias[i].hora}</h><br />
                                        <h>Local: {ocorrencias[i].localizacao}</h><br />
                                        <h>Registrado por: {ocorrencias[i].registeredBy}</h> <br />
                                        <div style={{ marginTop: "2%", marginBottom: "3%" }}>
                                            <h >{ocorrencias[i].descricao}</h><br />
                                        </div>
                                        {ConvertToImageFormat(ocorrencias[i].image, ocorrencias[i].data)}
                                    </>
                                }
                                    ocorrenciaDetails={
                                        {
                                            nome: ocorrencias[i].nome, categoria: ocorrencias[i].categoria, data: ocorrencias[i].data,
                                            hora: ocorrencias[i].hora, localizacao: ocorrencias[i].localizacao, descricao: ocorrencias[i].descricao,
                                            image: ocorrencias[i].image, registeredBy: ocorrencias[i].registeredBy
                                        }
                                    }
                                />
                            </div>
                        </Card.Text>
                    </>
                )
            }

            let filteredOcorrencias = cardsToFilter;
            if (filteredOcorrencias === undefined || filteredOcorrencias.length === 0) {
                return (
                    <div style={{ textAlign: "center", margin: "5%" }}>
                        <h>Nenhuma ocorrência com o(s) seguinte(s) filtro(s):</h>
                        <br />
                        {filterContext.categoria === "" ? (<></>) : (<><h>Categoria: {filterContext.categoria}</h> < br /></>)}
                        {filterContext.local === "" ? (<></>) : (<><h>Local: {filterContext.local}</h> <br /> </>)}
                        {filterContext.registrador === "" ? (<></>) : (<h>Registrador: {filterContext.registeredBy}</h>)}
                    </div >
                )
            }
            curCards = filteredOcorrencias;
        }

        const CardComponent = ({ ocorrencia }) => (
            <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.99 }}
                className="inline-block m-1 sm:w-72 w-32"
            >
                <Card className="relative h-16 min-h-16 sm:h-48 sm:min-h-48 shadow-md">
                    <Card.Body>
                        {ocorrencia}
                    </Card.Body>
                </Card>
            </motion.div>
        );
        const cards = search === "" ? curCards : cardsToFilter.filter((ocorrencia) => {
            return ocorrencia.props.children[0].props.children.toLowerCase().includes(search.toLowerCase())
        });

        return cards.map((ocorrencia) => <CardComponent ocorrencia={ocorrencia} />);
    }

    return (<> {loading === true ? <Spinner /> : displayCard()} </>);
}

export default Cards;