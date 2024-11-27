
import "./cardSearch.css"



const CardSearch = ({data}) => {
    return (

        <div className="promo-card">
                <img className="card-image"  src={data.pathImg} alt="Cali"  />
                <div className="card-content">
                    <h2 className="destination">{data.city}</h2>
                    <div className="discount">{data.discount}% Descuento</div>
                    <p className="description">{data.description}</p>
                
                </div>
        </div>
  
    )
}

export default CardSearch