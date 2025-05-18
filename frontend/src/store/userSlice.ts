import { UserType } from "@/types/UserType";
import { createSlice,PayloadAction } from "@reduxjs/toolkit";


const initialState:UserType={
    id:null,
    usn:null,
    type:null,
    name:null,
    department:null,
    admissionYear:null,
    year:null,
    semester:null,
    section:null
}

const userSlice=createSlice({
    name:"user",
    initialState,
    reducers:{
        setUser:(state,action:PayloadAction<UserType>)=>{
            state.id=action.payload.id;
            state.usn=action.payload.usn;
            state.type=action.payload.type;
            state.name=action.payload.name;
            state.department=action.payload.department;
            state.admissionYear=action.payload.admissionYear;
            state.year=action.payload.year;
            state.semester=action.payload.semester;
            state.section=action.payload.section;
        },
        clearUser:(state)=>{
            state.id=null;
            state.usn=null;
            state.type=null;
            state.name=null;
            state.department=null;
            state.admissionYear=null;
            state.year=null;
            state.semester=null;
            state.section=null;
        },
    },
});

export const {setUser,clearUser}=userSlice.actions;

export default userSlice.reducer;