import {useRouter} from "expo-router";
import {useState} from "react";
import {AdminProfile, DrawerItemOption} from "@/app/src/admin/models/drawer.model";

export function useDrawer(){
    const router = useRouter()

    const [profile]=useState<AdminProfile>({
        name:"Admin User",
        role:"System managment",
        avatarUrl:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjoN6L0ARAWPndgoAV_xsnlaBIrPs0P_lLWMsbucZ7wQ&s=10",
        version:"v4.4.4"
    })

    const navigationOptions:DrawerItemOption[]=[
        {name:"dashboard",label:"Dashboard",icon:"grid"},
        {name:"orders",label:"Orders",icon:"package"},
        {
            name:"inventory",
            label:"Inventory",
            icon:"archive",
            subitems:[
                {
                    name:"inventory",
                    label:"Categories",
                    icon:"folder",
                },
                {
                    name:"create-product",
                    label:"Products",
                    icon:"file-text",
                },
                {
                    name:"create-service",
                    label:"Servicios",
                    icon:"tool",
                }
            ]
        }
    ]

    return {
        profile,
        navigationOptions
    }
}