import React, { useState, useEffect } from "react";
import axios from 'axios';
import LoadingIcon from "../components/LoadingIcon";
import getEnvironment from "../../getenvironment";
import { Container } from "@chakra-ui/layout";
import {
    FormControl, FormErrorMessage, FormLabel, Center, Heading,
    Input, Button, Select
} from '@chakra-ui/react';
import { CustomTh, CustomLink, CustomBlueButton } from '../utils/customStyles'
import {
    Table,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
} from "@chakra-ui/table";

import { useParams } from "react-router-dom";

const Participants = () => {
    const params = useParams();
    const IdConf = params.confid;
  const apiUrl = getEnvironment();

    const initialData = {
        "confId": IdConf,
        "authorName": "",
        "authorDesignation": "",
        "authorInstitute": "",
        "paperTitle": "",
        "paperId": "",
    };
    const [formData, setFormData] = useState(initialData);

    const [editID, setEditID] = useState();
    const [loading, setLoading] = useState(false);

    const [data, setData] = useState([]);
    const [refresh, setRefresh] = useState(0);

    const {  authorName, authorDesignation, authorInstitute, paperTitle, paperId } = formData;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {

        axios.post(`${apiUrl}/conferencemodule/participant`, formData, {
            withCredentials: true

        })
            .then(res => {
                setData([...data, res.data]);
                setFormData(initialData);
                setRefresh(refresh + 1);
            })
            .catch(err =>{
                console.log(err);
                console.log(formData)
            } );

    };

    const handleUpdate = () => {
        axios.put(`${apiUrl}/conferencemodule/participant/${editID}`, formData, {
            withCredentials: true

        })
            .then(res => {
                setFormData(initialData);
                setRefresh(refresh + 1);
                setEditID(null)
            })
            .catch(err => console.log(err));
    };

    const handleDelete = (deleteID) => {
        axios.delete(`${apiUrl}/conferencemodule/participant/${deleteID}`, {
            withCredentials: true

        })
            .then(res => {
                console.log('DELETED RECORD::::', res);
                setRefresh(refresh + 1);
            })
            .catch(err => console.log(err));
    };

    const handleEdit = (editIDNotState) => {
        window.scrollTo(0, 0);
        axios.get(`${apiUrl}/conferencemodule/participant/${editIDNotState}`, {
            withCredentials: true

        })
            .then(res => {
                setFormData(res.data);
            })
            .catch(err => console.log(err));
    };

    useEffect(() => {
        setLoading(true);
        axios.get(`${apiUrl}/conferencemodule/participant/conf/${IdConf}`, {
            withCredentials: true

        })
            .then(res => {
                setData(res.data);
            })
            .catch(err => console.log(err))
            .finally(() => setLoading(false));

    }, [refresh]);

    return (
        <main className='tw-py-10  lg:tw-pl-72 tw-min-h-screen'>
            
            <Container maxW='5xl'>
                <Heading as="h1" size="xl" mt="6" mb="6">
                    Add a New Participant
                </Heading>

                <FormControl isRequired={true} mb='3' >
                    <FormLabel >Author Name:</FormLabel>
                    <Input
                        type="text"
                        name="authorName"
                        value={authorName}
                        onChange={handleChange}
                        placeholder="Author Name"
                        mb='2.5'
                    />
                </FormControl>
               
                <FormControl isRequired={true} mb='3' >
                    <FormLabel >Designation of Author:</FormLabel>
                    <Input
                        type="text"
                        name="authorDesignation"
                        value={authorDesignation}
                        onChange={handleChange}
                        placeholder="Designation"
                        mb='2.5'
                    />
                </FormControl>
                

                <FormControl isRequired={true} mb='3' >
                    <FormLabel >Institute of Author:</FormLabel>
                    <Input
                        type="text"
                        name="authorInstitute"
                        value={authorInstitute}
                        onChange={handleChange}
                        placeholder="Instuitute"
                        mb='2.5'
                    />
                </FormControl>
                <FormControl isRequired={true} mb='3' >
                    <FormLabel >Title of Paper:</FormLabel>
                    <Input
                        type="text"
                        name="paperTitle"
                        value={paperTitle}
                        onChange={handleChange}
                        placeholder="Paper Title"
                        mb='2.5'
                    />
                </FormControl>
                <FormControl isRequired={true} mb='3' >
                    <FormLabel >Paper Id:</FormLabel>
                    <Input
                        type="text"
                        name="paperId"
                        value={paperId}
                        onChange={handleChange}
                        placeholder="Paper Id"
                        mb='2.5'
                    />
                </FormControl>
               

                <Center>
              
                    <Button colorScheme="blue" type={editID ? "button" : "submit"} onClick={() => { editID ? handleUpdate() : handleSubmit() }}>
                        {editID ? 'Update' : 'Add'}
                    </Button>

            </Center>
                <Heading as="h1" size="xl" mt="6" mb="6">
                    Existing Participants </Heading>
                {!loading ? (

                    <TableContainer>
                        <Table
                            variant='striped'
                            size="md"
                            mt="1"
                        >
                            <Thead>
                                <Tr>
                                    <CustomTh>Name of Author</CustomTh>
                                    <CustomTh>Designation </CustomTh>
                                    <CustomTh>Institute</CustomTh>
                                    <CustomTh>Paper Id</CustomTh>
                                    <CustomTh>Paper Title</CustomTh>


                                    <CustomTh>Action</CustomTh>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {data.length > 0 ? (data.map((item) => (
                                    <Tr key={item._id}>
                                        <Td><Center>{item.authorName}</Center></Td>
                                        <Td><Center>{item.authorDesignation}</Center></Td>
                                        <Td><Center>{item.authorInstitute}</Center></Td>
                                        <Td><Center>{item.paperId}</Center></Td>
                                        <Td><Center>{item.paperTitle}</Center></Td>

                                        <Td><Center>
                                            <Button colorScheme="red" onClick={() => handleDelete(item._id)}>Delete </Button>
                                            <Button colorScheme="teal" onClick={() => {
                                                handleEdit(item._id);
                                                setEditID(item._id);
                                            }}>Edit </Button>
                                        </Center></Td>

                                    </Tr>))) :
                                    (
                                        <Tr>
                                            <Td colSpan="6" className="tw-p-1 tw-text-center">
                                                <Center>No data available</Center></Td>
                                        </Tr>
                                    )
                                }
                            </Tbody>
                        </Table>
                    </TableContainer>
                )

                    : <LoadingIcon />
                } </Container>
        </main>
    );
};

export default Participants;
