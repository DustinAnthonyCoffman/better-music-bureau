import React from 'react'
import {useRef, useEffect} from 'react'
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';

import { useForm, SubmitHandler } from "react-hook-form";
import * as yup from 'yup'
import axios from 'axios'
import { Inputs } from '../../Interfaces/interfaces'
import './signup.css'
import { useNavigate, Link} from 'react-router-dom';





export const Signup = () => {
    //TODO
    // const { register, handleSubmit, formState: { errors } } = useForm<Inputs>({
    //     resolver: yupResolver(schema),
    // })

const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();
const navigate = useNavigate()
const signedUp = useRef<boolean>(false)

const schema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().min(4).max(15).required(),
    confirmPassword: yup.string().oneOf([yup.ref('password'), null])
})

const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const email: string = data.email
    const password: string = data.password
    console.log('before we fetch', data)
    // const response = await axios.post('http://localhost:8080/signup', {
    //     email: email,
    //     password: password
    //     }).then(function(res) {
    //         if(res.status === 201) {
    //             console.log('heres the res', res)
    //             navigate('/')
    //         }
    //     }).catch(function (error) {
    //         console.log(error)
    //     })

    try {
        const res = await fetch('http://localhost:8080/signup', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include' //necessary for the jwt to be passed to browser!
        });
        //what we get back from the controller res.status(201).json({user: user._id})
        const data = await res.json();
        if(data.errors) {
            console.log(data.errors)
        }
        //if data response from controller has a user property then its success, send user to homepage
        if(data.user) {
            navigate('/')
        }
    }
    catch (err) {
        console.log(err);
    }


} 

    return (
        <>  
            <Card className='shadow-lg col-sm-6'>
                <Card.Header className='text-primary signup py-4'>Better Music Bureau </Card.Header>
                <Card.Body className='m-3'>
                    <Form onSubmit={handleSubmit(onSubmit)} className='shadow-4-strong'>
                        <Row>
                            <Col xs={5}>
                                <Form.Label htmlFor='email'>Email</Form.Label>
                            </Col>
                            <Col xs={5}>
                                <input className='mb-4' type='text' {...register('email', {required: true })} {...register} />
                                <>{errors.email?.message}</>
                            </Col>
                        </Row>    
                        <Row>
                            <Col xs={5}>
                                <Form.Label htmlFor='password'>Password</Form.Label>
                            </Col>
                            <Col xs={5}>
                                <input className='mb-4' type='password' {...register('password', {required: true })} {...register} />
                                <>{errors.password?.message}</>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={5}>
                                <Form.Label htmlFor='password'>Confirm Password</Form.Label>
                            </Col>
                            <Col xs={5}>
                                <input className='mb-4' type='password' {...register('confirmPassword', {required: true })} {...register} />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12}>
                                <Button type='submit' variant='primary'>Sign Up</Button>
                            </Col>
                            <>{errors.confirmPassword && "Passwords Should Match"}</>
                        </Row>
                    </Form>
                    <Row>
                        <Col xs={12}>
                            <Link to='/login'>Login</Link>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </>
        )
}
