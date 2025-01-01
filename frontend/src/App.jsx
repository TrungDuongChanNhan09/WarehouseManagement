import React from "react";
import './App.css'
import './style.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Login from './Pages/Login/Login.jsx';
import Register from './Pages/Register/Register.jsx';
import DashBoard from "./Pages/DashBoard/DashBoard.jsx";
import Navbar from "./Component/Navbar/Navbar.jsx";
import Inventory from "./Pages/Inventory/Inventory.jsx";
import Category from "./Pages/Category/Category.jsx";
import Product from "./Pages/Product/Product.jsx";
import Employee from "./Pages/Employee/Employee.jsx";
import Shelf from "./Pages/Shelf/Shelf.jsx";
import ImportShipment from "./Pages/ImportShipment/ImportShipment.jsx";
import Supplier from "./Pages/Supplier/Supplier.jsx";
import Order from "./Pages/Order/Order.jsx";
import ExportShipment from "./Pages/ExportShipment/ExportShipment.jsx";
import ProductDetail from "./Pages/Product/SubPages/ProductDetail.jsx";

const App = () =>{
  return(
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route index element = {<Login/>}/>
          <Route path='register' element={<Register/>}/>
          <Route path='login' element={<Login/>}/>
          <Route path='app' element={<Navbar/>}>
            <Route index element={<DashBoard/>}/>
            <Route path='home' element={<DashBoard/>}/>
            <Route path='order' element={<Order/>}/>
            <Route path='inventory' element={<Inventory/>}/>
            <Route path='category' element={<Category/>}/>
            <Route path='product' element={<Product/>}/>
            <Route path="product/detail/:productId" element={<ProductDetail/>} />
            <Route path='employee' element={<Employee/>}/>
            <Route path='shelf' element={<Shelf/>}/>
            <Route path='importshipment' element={<ImportShipment/>}/>
            <Route path='supplier' element={<Supplier/>} />
            <Route path='exportshipment' element={<ExportShipment/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}
export default App