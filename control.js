/*
Desarrollo de un control de informacion paginada
Desarrollado utilizando la libreria React v15.4.2
Autor: Ing. Cesar San Lucas Alvarado
*/

var initial_Page = 1;

/*Display_Info_Items es un componente para realizar el renderizado de la lista de elementos
que se tiene en info_items*/
class Display_Info_Items extends React.Component{
  render(){
    return(
      <div id = "info_list" className="list-group">
        {this.props.info_items.map(item => (
            <div className="list-group-item">
              <h4 className="list-group-item-heading"><b>Title:</b>  {item.title}</h4>
              <p className="list-group-item-text"><b>Id:</b>  {item.id}</p>
              <p className="list-group-item-text"><b>Body:</b>  {item.body}</p>
            </div>
        ))}
      </div>
    );
  }
}

/*Info_Container es un componente que mantiene un arreglo de Info_items como estado actual, que representan
a los 10 elementos que deben constar en una Pagina actual, ademas un estado para la
pagina actual(current_page) que es utilizada para definir a info_items, en caso de que se actualice el estado
current_page se actualizara la lista de elementos de info_items, esto ocurre cuando se presiona
los botones de Anterior y Siguiente*/
class Info_Container extends React.Component{
  constructor(props){
    super(props);
    this.state = {info_items: [], current_page: this.props.num_pagina};
  }

  componentDidMount(){
    this.getInfo_json_from_url();
  }

  componentWillReceiveProps(nextProps){
    console.log("WIll receive Props");
    console.log(nextProps.num_pagina);
    var newItem = {id:221,title:'E221',body:'B221'};
    this.setState((prevState) => ({
      current_page: nextProps.num_pagina
    }));
    this.state.info_items.splice(0, this.state.info_items.length);
    console.log(this.state.info_items);
    console.log("-----");
  }

  componentDidUpdate(nextProps){
    if (nextProps.num_pagina != this.state.current_page){
      console.log("componentDidUpdate");
      console.log(this.state.info_items);
      console.log(this.state.current_page);
      this.getInfo_json_from_url();
    }
  }

  render(){
    return(
        <Display_Info_Items info_items={this.state.info_items} />
    );
  }

  /* Funcion para generar los requerimientos Ajax para obtener la informacion,
  se realizan 10 requerimientos para obtener la info, por cada operacion al presionar
  los botones de Anterior o Siguiente*/
  getInfo_json_from_url(){
    var _this = this;
    var index = this.state.current_page;
    if (index > 1){
      index = (index * 10) - (10-1);
    }
    var max_index = index + 10; // usar multiplicacion por el RANGO
    var root = "https://jsonplaceholder.typicode.com";
    console.log(index);
    console.log(max_index);
    while (index < max_index) {
      var url =  root + '/posts/' + index.toString();
      this.serverRequest = axios.get(url).then(function(result) {
            var newInfoItem = {id:result.data.id, title:result.data.title, body:result.data.body};
            _this.setState((prevState) => ({
              info_items: prevState.info_items.concat(newInfoItem)
            }));
          });
      index = index + 1;
    }
  }
}

/* Componente Update_Info_btn para manejar como su estado el numero de pagina
y las acciones en los botones Anterior y Siguiente que realizan un update a
de incrementar o disminuir su estado dependiendo el caso*/
class Update_Info_btn extends React.Component {
  constructor(props) {
    super(props);
    this.handleClkNext = this.handleNext.bind(this);
    this.handleClkPrev= this.handlePrev.bind(this);
    this.state = {num_pagina:this.props.init_state}; // Considerar agregar el maximo de numero de paginas
  }
  render(){
    var next_tag = <li className="next"><a onClick={this.handleClkNext}>Siguiente</a></li>;
    var previous_tag = <li className="previous"><a onClick={this.handleClkPrev}>Anterior</a></li>;
    if (this.state.num_pagina <= 1){
      previous_tag = <li className="previous disabled"><a onClick={this.handleClkPrev}>Anterior</a></li>;
    }
    if (this.state.num_pagina >= 10){
      next_tag = <li className="next disabled"><a onClick={this.handleClkNext}>Siguiente</a></li>;
    }
    return(
      <div>
      <Info_Container num_pagina={this.state.num_pagina}/>
      <nav>
        <ul className="pager">
          {previous_tag}
          {next_tag}
        </ul>
      </nav>
      </div>
    );
  }

  handlePrev(e){
    if (this.state.num_pagina > 1){
      this.setState({num_pagina: this.state.num_pagina - 1})
    }
  }

  handleNext(e){
    if(this.state.num_pagina < 10){
        this.setState({num_pagina: this.state.num_pagina + 1})
    }
  }
}

/* Componente para inicializar el Renderizado inicial con el componente Update_Info_btn
e inicializando el estado inicial del numero de Pagina usado en la paginacion */
class MainApp extends React.Component {
  render() {
    return (
      <Update_Info_btn init_state = {this.props.init_Page} />
    );
  }
}

ReactDOM.render(<MainApp init_Page={initial_Page} />, main_container)
