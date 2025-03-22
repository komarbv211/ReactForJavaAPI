// Header.tsx
import React from "react";
import { Link } from "react-router-dom";
import { Avatar, Dropdown, MenuProps } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { logOut } from "../store/slices/userSlice";
import { useAppDispatch, useAppSelector } from "../store";
import { useNavigate } from "react-router-dom";
import { APP_ENV } from "../env/index.ts";
import { useGetPhotoUserQuery } from "../services/apiUser.ts";

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);
  const data = useGetPhotoUserQuery(Number(user?.id));
  const navigate = useNavigate();
  

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: <Link to="/profile">Профіль</Link>,
      icon: <UserOutlined />,
    },    
    {
      key: "2",
      label: "Вийти",
      icon: <LogoutOutlined />,
      onClick: () => {
        dispatch(logOut());
        navigate("/");
      },
    },
  ];

  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-gray-800">My Website</h1>
      <nav>
        <ul className="flex gap-4 items-center">
          <li>
            <Link to="/" className="text-gray-600 hover:text-blue-500">
              Home
            </Link>
          </li>
          <li>
            <Link to="/categories" className="text-gray-600 hover:text-blue-500">
              Категорії
            </Link>
          </li>
          {user ? (
            <Dropdown menu={{ items }} trigger={["click"]}>
              <div className="flex items-center gap-2 cursor-pointer">
                <Avatar
                  src={data.data?.photo ? `${APP_ENV.REMOTE_SMALL_IMAGES_URL}${data.data?.photo}` : <UserOutlined />}
                  className="hover:opacity-100"
                />
                <span className="text-gray-600 hover:text-blue-500">{user.email}</span>
              </div>
            </Dropdown>
          ) : (
            <>
              <li>
                <Link to="/register" className="text-gray-600 hover:text-blue-500">
                  Реєстрація
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-600 hover:text-blue-500">
                  Вхід
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;