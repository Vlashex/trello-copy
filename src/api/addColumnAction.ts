"use server"

import axios from "axios"




export async function addColumn(): Promise<void> {
    axios.post(process.env.BACKEND_URL + `columns`)   
}