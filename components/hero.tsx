export const Hero = () => (
  <div className="bg-neutral-100 border-b py-10 md:py-20 px-4 md:px-8">
    <div className="max-w-4xl mx-auto">
      <div className=" text-neutral-800 leading-snug">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold">
          Encuentra{" "}
          <span className="md:underline transition-all delay-500 decoration-indigo-600 underline-offset-4">
            marcas
          </span>{" "}
          con{" "}
          <span className="before:block before:absolute before:-inset-1 md:before:-skew-y-3 before:bg-indigo-500 relative inline-block">
            <span className="relative text-neutral-100">principios</span>
          </span>
        </h1>
        {/* <div className="compra-sostenible-background bg-cover bg-center">
              <h1 className="text-6xl font-bold mix-blend-lighten text-black bg-neutral-100">
                Encuentra marcas con principios
              </h1>
            </div> */}
        <div className="md:w-9/12 text-xl md:text-2xl text-neutral-500">
          <p className="pt-8">
            Que producen cerca de ti, que se preocupan por contaminar menos o
            que utilizan materiales reciclados.
          </p>
          <p className="pt-8">
            Tú decides como poner tu granito de arena para promover un consumo
            más sostenible.
          </p>
          <p className="pt-8">Hay vida más allá de Primark, Nike o Ikea.</p>
        </div>
      </div>
    </div>
  </div>
);
