import { Title as TitleBase, Props as TitleProps } from "components/title";
import { PropsWithChildren } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "El proyecto ~ comprasostenible.co",
};

const Title = (props: PropsWithChildren<TitleProps>) => (
  <TitleBase className="mt-10 first:mt-0 mb-2" {...props} />
);

export default function About() {
  return (
    <>
      <Title>¿Quién está detrás?</Title>
      <p>
        Mi nombre es{" "}
        <a
          href="http://marciobarrios.com"
          className="text-indigo-600 hover:text-stone-600 font-semibold"
        >
          Marcio Barrios
        </a>
        , y este pequeño (e inacabado) proyecto surge de la necesidad propia de
        ir recopilando distintos enlaces de tiendas online sostenibles para
        usarlos en un futuro.
      </p>

      <Title>Sobre el proyecto</Title>
      <p>
        Vivimos en un mundo en el que la ropa, los accesorios o incluso los
        muebles son muy baratos, pero no siempre somos conscientes de las
        implicaciones que nuestra compra puede tener tanto para el medio
        ambiente como para las condiciones de trabajo de quien los produce.
      </p>
      <p className="mt-6">
        En mi caso, empecé a interesarme por ropa que se fabricara en España (o
        almenos en Europa), con condiciones de trabajo dignas y alejada de modas
        que cambian constantemente.
      </p>
      <p className="mt-6">
        Este concepto de tener conciencia al comprar, de preocuparse por la
        calidad, de la durabilidad, de los procesos y de recursos se conoce como{" "}
        <em>Slow Fashion</em>. Y la realidad es que hay alternativas más
        sostenibles a muchos productos que compramos en masa como ropa, muebles,
        decoración, cosmética, higiene o calzado. Pero obviamente tiene un coste
        extra y no son tan fáciles de encontrar, ya que no suelen haber grandes
        multinacionales detrás fabricando a destajo en la otra punta del mundo.
      </p>
      <p className="mt-6">
        En realidad, la mejor alternativa al consumismo desmesurado es evitar
        comprar compulsivamente, centrarnos en comprar únicamente cuando
        realmente lo necesitamos, e intentar comprar artículos de segunda mano
        siempre que sea posible, pero este es otro tema que está fuera del
        alcance de esta web. Aquí nos vamos a centrar en promover marcas
        alternativas.
      </p>
      <p className="mt-6">
        En definitiva, estás en el sitio correcto si estás interesado en poner
        tu granito de arena para poner un poco de cordura en este mundo
        globalizado y consumista.
      </p>

      <Title>¿Cómo es el proceso de elegir las marcas?</Title>
      <p>
        Básicamente yo mismo las eligo una a una según los criterios que
        considero razonables:
      </p>
      <ul className="mt-6 list-disc marker:text-indigo-300">
        <li>Calidad, trazabilidad y durabilidad del producto</li>
        <li>
          Localización de la empresa (intento promover tiendas de proximidad)
        </li>
        <li>
          Tamaño de la empresa (intento dar visibilidad a productores pequeños)
        </li>
        <li>
          Fabricación de sus productos (promuevo la proximidad, los materiales
          orgánicos o reciclados, y los productos hechos a mano)
        </li>
        <li>Valores que promueve la marca</li>
        <li>Iniciativas respecto al medio ambiente</li>
      </ul>
      <p className="mt-6">
        Por tanto en este listado en ningún caso van a estar todas las tiendas
        sostenibles posibles, pero hago todo lo posible para informarme sobre
        cada una de las que añado para que sea una selección coherente y que
        abarque distintos tipos de productos.
      </p>
      <p className="mt-6">
        Por último, quiero remarcar que no tengo ningún acuerdo comercial con
        ninguna de ellas, no acepto dinero de ninguna marca para que esté dentro
        de este listado ni para que tenga un orden prioritario.
      </p>

      <Title>Código abierto</Title>
      <p>
        El proyecto está alojado en Github y está disponible para cualquiera que
        esté interesado:{" "}
        <a
          href="https://github.com/marciobarrios/comprasostenible"
          className="text-indigo-600 hover:text-stone-600 font-semibold"
        >
          https://github.com/marciobarrios/comprasostenible
        </a>
      </p>

      <Title>Contacto</Title>
      <p>
        Si quieres darme feedback, recomendarme alguna marca sostenible o
        cualquier otra cosa puedes contactarme en{" "}
        <a
          href="http://twitter.com/marciobarrios"
          className="text-indigo-600 hover:text-stone-600 font-semibold"
        >
          Twitter
        </a>
        .
      </p>
    </>
  );
}
