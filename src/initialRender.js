import { productRender } from "./inventory"
import { productSideBar } from "./selectors"
import products from "./states"

const initialRender = () => {
    // productSideBar.classList.remove("translate-x-full")
    productRender(products)
}

export default initialRender