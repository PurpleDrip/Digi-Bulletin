import { ServerType } from "@/types/SeverType";
import { createSlice,PayloadAction } from "@reduxjs/toolkit";


const initialState:ServerType={
    serverIds:null,
}

const userSlice=createSlice({
    name:"server",
    initialState,
    reducers:{
        setServer:(state,action:PayloadAction<ServerType>)=>{
            state.serverIds = action.payload.serverIds;
        }
    },
});

export const {setServer}=userSlice.actions;
export default userSlice.reducer;

