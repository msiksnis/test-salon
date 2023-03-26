import Image from "next/image";

export default function Hudpleie({ hudpleie }) {
  return (
    <div className="font-poppins my-24 md:mt-44 md:px-0 xl:px-40">
      <h1 className="my-10 text-center text-2xl text-gray-700 md:text-4xl">
        Hudpleie
      </h1>
      <div className="flex">
        <div className="hidden md:flex md:w-1/3">
          <Image
            className="object-cover"
            src="/images/hudpleie/hudpleie.jpeg"
            width={500}
            height={800}
          />
        </div>
        <div className="w-full bg-gradient-to-tr from-[#ffeaeabc] to-[#f2ecec43] pt-4 pb-10 md:w-2/3 md:pt-14">
          <h2 className="hidden p-4 text-center text-xl md:px-10 md:text-2xl">
            Hudpleie Dame
          </h2>
          {hudpleie.map(
            ({ title, price, _id, shortDescription, directLink }) => (
              <div key={_id} className="transition-all hover:bg-[#f2ecec]">
                <a
                  href={directLink}
                  rel="noreferrer"
                  target="_blank"
                  className="cursor-pointer"
                >
                  <div className="border-b border-gray-200 px-4 pt-5 pb-2 md:px-10">
                    <div className="flex justify-between">
                      {title}
                      <h3 className="font-rubik whitespace-nowrap pl-6 font-normal opacity-75">
                        {price} kr
                      </h3>
                    </div>
                    <p className="py-1 text-sm opacity-60">
                      {shortDescription}
                    </p>
                  </div>
                </a>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
