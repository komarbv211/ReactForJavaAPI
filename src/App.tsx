import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import CategoryListPage from "./pages/Category/CategoryListPage.tsx";
import CreateCategoryPage from "./pages/Category/CreateCategoryPage.tsx";
import EditCategoryPage from "./pages/Category/EditCategoryPage.tsx";
import ProductList from "./pages/Product/ProductList.tsx";
import EditProductPage from "./pages/Product/EditProductPage.tsx";
import CreateProductPage from "./pages/Product/CreateProductPage.tsx";
import ProductDetail from "./pages/Product/ProductDetail.tsx";
import RegisterPage from "./pages/auth/RegisterPage.tsx";
import LoginPage from "./pages/auth/LoginPage.tsx";
import ProfilePage from "./pages/auth/ProfilePage.tsx";

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<HomePage />} />
                    <Route path="about" element={<AboutPage />} />
                    <Route path="contact" element={<ContactPage />} />
                    <Route path="categories">
                        <Route index element={<CategoryListPage />} />
                        <Route path="create" element={<CreateCategoryPage />} />
                        <Route path="edit/:id" element={<EditCategoryPage />} />
                        {/*<Route path=":id" element={<ViewCategoryPage />} />*/}
                    </Route>
                    <Route path="products">
                        <Route index element={<ProductList />} />
                        <Route path="create" element={<CreateProductPage />} />
                        <Route path="edit/:id" element={<EditProductPage />} />
                        <Route path="product/:id" element={<ProductDetail />} />
                    </Route>
                    <Route path="register" element={<RegisterPage/>}/>
                    <Route path="login" element={<LoginPage/>}/>
                    <Route path="/profile" element={<ProfilePage />} />
                </Route>
            </Routes>
        </Router>
    );
};

export default App;
