import {useState, useEffect} from 'react'
import axios from 'axios';
import { Table } from 'antd';
import { StarOutlined } from '@ant-design/icons'

// styles
import 'antd/dist/antd.css';
import './App.css'

/**
 *  Object Structure : 
 *      { id, 
 *        title, 
 *        price, 
 *        description, 
 *        category, 
 *        image, 
 *        rating : { 
 *            rate , 
 *            count
 *        } 
 *      }
 */

function App() {

  // URL du service backend à appeler
  const URL = `https://fakestoreapi.com/products`

  // le conteneur des données qui seront récupérées via l'api
  // initialisation avec un tableau vide
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // filtre : on cherche à filtrer les données par categorie
  const [categories, setCategories] = useState([]);

  const columns = [
    {
      key : "1",
      title : "Image",
      dataIndex : "image", 
      render: (image) => {
        return <img className='photo' src={image} alt='' />
      }
    },
    {
      key : "2",
      title : "Title",
      dataIndex : "title", 
      render : (title) => {
        return <p className='title'>{title}</p>
      }
    },
    {
      key : "3",
      title : "Description",
      dataIndex : "description", 
      render : (description) => {
        return <p className='paragraph'>{description}</p>
      }
    },
    {
      key : "4",
      title : "Price",
      dataIndex : "price", 
      render : (price) => {
        return <p><b>{price}$</b></p>
      },
      sorter : (item1, item2) => {
        return item1.price - item2.price
      }
    },
    {
      key : "5",
      title : "Category",
      dataIndex : "category", 
      filters : categories,
      onFilter : (value, item) => {
        return item.category === value;
      }
    },
    {
      key : "6",
      title : "Rating",
      dataIndex : "rating", 
      render : (rating) => {
        return <p className='rating'> 
                  <p className='rate'>{rating.rate} <StarOutlined className='star'/> </p>
                  <i>Based on {rating.count} votes</i>
                </p>
      },
      sorter : (item1, item2) => {
        return item1.rating.rate - item2.rating.rate
      }
    }
  ]

  /**
   *  Description : ce bout de code sera exécuté à chaque chargement du composant
   *  But : récupérer la liste des produits via l'api
   */
  useEffect(() => {
    setLoading(true);
    axios.get(URL)
         .then( result =>{
            setData(result.data);
            let temporary = []
            for(let item of result.data){
              temporary.push(item.category);
            }
            temporary =  temporary.filter(onlyUnique);
            let finalArray = []
            for(let item of temporary)
            {
              finalArray.push({text : item , value: item})
            }
            setCategories(finalArray);
         })
         .catch( error => {
            alert("il y a un problème!");
         })
         .finally(()=>{
           setLoading(false);
         })
  }, [setData, URL, setCategories]);

  /* 
  * cette fonction sert à comparer l'index de la valeur avec
  *  l'index actuel, elle va conserver que la première occurence
  */
  const onlyUnique = (value, index, self) => {
    return self.indexOf(value) === index;
  }

  return (
    <>
      <div className='header'>
        <p className='gtitle'>Products</p>
      </div>
      <div className='App'>
          <Table
            loading={loading}
            dataSource={data}
            columns={columns}
            pagination={{
              pageSize : 5
            }}
          >
          </Table>
      </div>
      <div className='footer'>
        <p className='owner'>Manal Nekkas - Technical test 2022 - frontend</p>
      </div> 
    </> 
  );
}

export default App;
