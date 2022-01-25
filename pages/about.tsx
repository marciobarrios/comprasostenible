import { Layout } from "components/layout";
import { Title } from "components/title";

export default function About() {
  return (
    <Layout>
      <Title className="mb-4">¿Quién está detrás?</Title>
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

      <Title className="mt-10 mb-4">Sobre el proyecto</Title>
      <p className="mt-6">
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
        Y la realidad es que hay alternativas más sostenibles a muchos productos
        que compramos en masa como ropa, muebles, decoración, cosmética, higiene
        o calzado. Pero obviamente tiene un coste extra y no son tan fáciles de
        encontrar, ya que no suelen haber grandes multinacionales detrás
        fabricando a destajo en la otra punta del mundo.
      </p>
      <p className="mt-6">
        En definitiva, estás en el sitio correcto si estás interesado en poner
        tu granito de arena para poner un poco de cordura en este mundo
        globalizado y consumista.
      </p>

      <Title className="mt-10 mb-4">Código abierto</Title>
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

      <Title className="mt-10 mb-4">Contacto</Title>
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
    </Layout>
  );
}
