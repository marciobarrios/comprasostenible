import { Layout } from "components/layout";
import { Title } from "components/title";

export default function About() {
  return (
    <Layout>
      <Title className="mb-4">Sobre el proyecto</Title>
      <p>
        Mi nombre es{" "}
        <a
          href="http://marciobarrios.com"
          className="text-indigo-600 hover:text-stone-600 font-semibold"
        >
          Marcio Barrios
        </a>
        , y este pequeño (e inacabado) proyecto surge de la necesidad propia de
        ir recopilando distintos enlaces de tiendas online para usarlos en un
        futuro cuando sea necesario.
      </p>
      <p className="mt-6">
        Vivimos en un mundo en el que la ropa es muy barata, pero no siempre
        somos conscientes de las implicaciones que este hecho puede tener tanto
        para el medio ambiente como para las condiciones de trabajo. En mi caso,
        empecé a interesarme por ropa que se fabricara en España (o almenos en
        Europa), con condiciones de trabajo dignas y alejada de modas que
        cambian constantemente.
      </p>
      <p className="mt-6">
        Y la realidad es que hay alternativas más sostenibles a muchos productos
        que compramos en masa como ropa, muebles y decoración, cosmética e higiene o
        calzado. Pero obviamente tiene un coste extra, no suelen haber grandes
        multinacionales detrás fabricando a destajo en la otra punta del mundo.
      </p>
      <p className="mt-6">
        En definitiva, estás en el sitio correcto si estás interesado en poner
        tu granito de arena para poner un poco de cordura en este mundo
        globalizado y consumista.
      </p>

      <Title className="mt-10 mb-4">Código abierto</Title>
      <p>
        El proyecto está alojado en Github y está disponible para cualquiera que
        esté interesado: Enlace a github
      </p>

      <Title className="mt-10 mb-4">Contacto</Title>
      <p>
        Si quieres darme feedback, recomendarme alguna marca sostenible o
        cualquier otra cosa puedes contactarme a través de{" "}
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
