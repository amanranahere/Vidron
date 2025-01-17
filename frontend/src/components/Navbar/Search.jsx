import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { GoSearch } from "react-icons/go";
import Input from "../Input.jsx";
import Button from "../Button.jsx";

function Search() {
  const { register, handleSubmit, reset } = useForm();
  const navigate = useNavigate();

  const onSubmit = (data) => {
    navigate(`/search/${data?.query}`);
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex items-center w-[35%] md:w-full md:max-w-lg"
    >
      <div className="relative flex-grow">
        <Input
          className="rounded-l-3xl pl-5"
          placeholder="Search"
          {...register("query", { required: true })}
        />
      </div>

      <button
        type="submit"
        className="h-full py-2 px-2 md:px-5 bg-[#2a2a2a] rounded-r-3xl hover:bg-[#5a5a5a] transition-colors outline-none"
      >
        <GoSearch className="text-gray-200 w-6 h-6" />
      </button>
    </form>
  );
}

export default Search;
