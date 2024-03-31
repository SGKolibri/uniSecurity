import { useEffect, useState } from 'react'
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, } from '@chakra-ui/react'
import { Input, Select } from '@chakra-ui/react'
import { FaUser } from "react-icons/fa";
import { motion } from 'framer-motion';
import { BsPencilSquare } from '@react-icons/all-files/bs/BsPencilSquare';
import InputMask from 'react-input-mask';
import axios from 'axios';

export default function ModalGuarda({ isOpen, onClose, selectedGuarda, getGuardas }) {

    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [guardaImage, setGuardaImage] = useState("");
    const [efetivacao, setEfetivacao] = useState("");
    const [turno, setTurno] = useState("");
    const [cpf, setCpf] = useState("");

    const [nameTemp, setNameTemp] = useState("");
    const [surnameTemp, setSurnameTemp] = useState("");
    const [emailTemp, setEmailTemp] = useState("");
    const [passwordTemp, setPasswordTemp] = useState("");
    const [guardaImageTemp, setGuardaImageTemp] = useState("");
    const [efetivacaoTemp, setEfetivacaoTemp] = useState("");
    const [turnoTemp, setTurnoTemp] = useState("");
    const [cpfTemp, setCpfTemp] = useState("");

    const [editing, setEditing] = useState(false);

    function encodeImageFileAsURL(element) {
        let file = element;
        let reader = new FileReader();
        reader.addEventListener("load", function () {
            setGuardaImage(reader.result);
        });
        reader.readAsDataURL(file);
    }

    const handleUpdateGuarda = (e) => {
        e.preventDefault();

        setOriginalToTemp();

        try {
            axios.put(`${process.env.REACT_APP_BACKEND_URL}/update-user/${selectedGuarda._id}`, {
                name,
                surname,
                email,
                password,
                image: guardaImage,
                efetivacao,
                turno,
                cpf
            }).then(() => {
                onClose();
                getGuardas();
            })
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        setSelectedGuarda(selectedGuarda);
    }, [selectedGuarda])

    const setSelectedGuarda = (guarda) => {
        setNameTemp(guarda.name);
        setSurnameTemp(guarda.surname);
        setEmailTemp(guarda.email);
        setGuardaImageTemp(guarda.image);
        setEfetivacaoTemp(guarda.efetivacao);
        setTurnoTemp(guarda.turno);
        setCpfTemp(guarda.cpf);
    }

    const setOriginalToTemp = () => {
        setName(nameTemp);
        setSurname(surnameTemp);
        setEmail(emailTemp);
        setGuardaImage(guardaImageTemp);
        setEfetivacao(efetivacaoTemp);
        setTurno(turnoTemp);
        setCpf(cpfTemp);
    }

    return (
        <>
            <Modal isCentered={true} isOpen={isOpen} onClose={onClose} size={'lg'} >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        <div className="pt-2 flex flex-col justify-center items-center">
                            <label className={`flex py-3 px-6 ${guardaImageTemp ? 'bg-white' : 'bg-[#ddd]'} text-[#aaa] rounded-md justify-center gap-2 items-center hover:bg-[#ccc] cursor-pointer`} >
                                {guardaImageTemp ?
                                    <img src={guardaImageTemp} alt="guarda" className='w-32 h-32' />
                                    :
                                    <FaUser className='w-32 h-32' />
                                }
                                <Input isDisabled={!editing ? true : false} type="file" id='image' className="hidden" placeholder="imagem" onChange={e => { encodeImageFileAsURL(e.target.files[0]) }} />
                            </label>
                            <label className='mt-auto font-normal text-base cursor-pointer'>
                                <motion.button className='flex gap-1 items-center cursor-pointer'
                                    onClick={(event) => { setEditing(!editing) }} >
                                    <BsPencilSquare />
                                    <label className='cursor-pointer'>
                                        {
                                            !editing ? "Editar cadastro" : "Cancelar edição"
                                        }
                                    </label>
                                </motion.button>
                            </label>
                        </div>
                    </ModalHeader>
                    <ModalBody>
                        <div className="flex gap-5">
                            <div className="w-1/2">
                                <label className="text-sm">
                                    Nome
                                </label>
                                <Input isDisabled={!editing ? true : false} value={nameTemp} required className="border border-black" onChange={(e) => setNameTemp(e.target.value)} />
                            </div>
                            <div className="w-1/2">
                                <label className="text-sm">
                                    Sobrenome
                                </label>
                                <Input isDisabled={!editing ? true : false} value={surnameTemp} required className="border border-black" onChange={(e) => setSurnameTemp(e.target.value)} />
                            </div>
                        </div>
                        <div className="py-2">
                            <label className="text-sm">
                                CPF
                            </label>
                            <InputMask
                                value={cpfTemp} required
                                mask="999.999.999-99"
                                onChange={(e) => setCpf(e.target.value)}
                            >
                                {(inputProps) => <Input isDisabled={!editing ? true : false}  {...inputProps} className="border border-black" />}
                            </InputMask>
                        </div>
                        <div className="py-2">
                            <label className="text-sm">
                                Email
                            </label>
                            <Input isDisabled={!editing ? true : false} value={emailTemp} type="email" required className="border border-black" onChange={(e) => setEmailTemp(e.target.value)} />
                        </div>
                        <div className="py-2">
                            <label className="text-sm">
                                Senha
                            </label>
                            <Input isDisabled={!editing ? true : false} value={''} required type="password" minLength={6} className="border border-black" onChange={(e) => setPasswordTemp(e.target.value)} />
                        </div>
                        <div className="flex gap-5">
                            <div className="w-1/2">
                                <label>
                                    Data de efetivação
                                </label>
                                <Input isDisabled={!editing ? true : false} value={efetivacaoTemp} required type="date" className="border border-black" onChange={(e) => setEfetivacaoTemp(e.target.value)} />
                            </div>
                            <div className="w-1/2">
                                <label>
                                    Turno
                                </label>
                                <Select isDisabled={!editing ? true : false} value={turnoTemp} required className="border border-black" onChange={(e) => setTurnoTemp(e.target.value)}>
                                    <option value="manha">Manhã</option>
                                    <option value="tarde">Tarde</option>
                                    <option value="noite">Noite</option>
                                </Select>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <div className="w-full py-1 flex justify-evenly">
                            <motion.button className='px-4 py-[7px] bg-black text-white rounded-[5px]'
                                onClick={(e) => handleUpdateGuarda(e)}
                            >
                                Confirmar
                            </motion.button>
                            <motion.button className='px-4 py-[7px] bg-white border border-black text-black rounded-[5px]' onClick={onClose}>
                                Cancelar
                            </motion.button>
                        </div>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}