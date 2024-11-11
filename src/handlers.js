import { productSideBar } from "./selectors"

export const manageInventoryBtnHandler = () => {
    productSideBar.classList.remove("translate-x-full")
    productSideBar.classList.add("duration-200")
}

export const closeSideBarBtnHandler = () => {
    productSideBar.classList.add("translate-x-full","duration-200")
    
}

export const checkOutHandler = () => {
    // console.log("U check out")
    window.print()
}