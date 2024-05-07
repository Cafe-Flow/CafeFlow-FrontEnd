import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";
import axios from "axios";

function Shoplist() {
  const [data, setData] = useState(null);
  const [sortBy, setSortBy] = useState("0"); // Default sort option is "0"

  useEffect(() => {
    const fetchData = async () => {
      try {
        let url = "http://localhost:8080/api/cafe";
        if (sortBy === "1") {
          url += ""; // Append sort option to URL if sortBy is "1"
        }
        else if (sortBy === "0") {
          url += "?sort-by=created-at";
        }
        const response = await axios.get(url);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [sortBy]); // Run effect whenever sortBy changes

  const handleSortChange = (e) => {
    const selectedValue = e.target.value;
    setSortBy(selectedValue); // Update sortBy state with the selected option value
  };

  let listLength = data ? parseInt(data.length) : 0;

  const radios = [
    { name: '기본 순', value: '0' },
    { name: '최신 순', value: '1' }
  ];

  const [radioValue, setRadioValue] = useState('0');

  return (
    <div className="Shop">
      <div>
        <h3>카페 목록</h3>
        <div class="buttons-group">
          <ButtonGroup style={{}}>
            {radios.map((radio, idx) => (
              <ToggleButton
                key={idx}
                id={`radio-${idx}`}
                type="radio"
                variant={idx % 2 ? 'outline-success' : 'outline-danger'}
                name="radio"
                value={radio.value}
                checked={radioValue === radio.value}
                onChange={(e) => {
                  setRadioValue(e.currentTarget.value);
                  setSortBy(e.currentTarget.value);
                }}
              >
                {radio.name}
              </ToggleButton>
            ))}
          </ButtonGroup>
        </div>
      </div>
      <br />
      <Row xs={1} md={3} className="g-4">
        {Array.from({ length: listLength }).map((_, idx) => (
          <Col key={idx}>
            <Card>
              <Card.Img variant="top" src="/img/cafelistimg.jpg" />
              <a href={`/shop/${data[idx].id}`}>
                <Card.Body>
                  <Card.Title>{data[idx].name}</Card.Title>

                  <Card.Text>
                    ⭐️{data[idx].reviewsRating} ({data[idx].reviewCount})
                  </Card.Text>
                </Card.Body>
              </a>
            </Card>
          </Col>
        ))}
      </Row>
      <br />
      <a class="cafe-register-button">
        <Button href="/shopregister" style={{color:"white"}}>카페 등록</Button>
      </a>
    </div>
  );
}

export default Shoplist;
