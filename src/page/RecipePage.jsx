import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Modal,
  Alert,
  Spinner,
  Badge,
} from "react-bootstrap";
import { useEvent } from "../contexts/EventContext";

export default function RecipePage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [message, setMessage] = useState("");
  const [addingToEvent, setAddingToEvent] = useState(false);
  const { events, addRecipeToEvent } = useEvent();

  useEffect(() => {
    fetchRandomRecipes();
  }, []);

  const fetchRandomRecipes = async () => {
    setLoading(true);
    try {
      const promises = Array(12)
        .fill()
        .map(() =>
          fetch("https://www.themealdb.com/api/json/v1/1/random.php").then(
            (res) => res.json()
          )
        );

      const results = await Promise.all(promises);
      const meals = results.map((result) => result.meals[0]).filter(Boolean);
      setRecipes(meals);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      setMessage("Error loading recipes. Please try again.");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  const searchRecipes = async (query) => {
    if (!query.trim()) {
      fetchRandomRecipes();
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(
          query
        )}`
      );
      const data = await response.json();
      setRecipes(data.meals || []);

      if (!data.meals || data.meals.length === 0) {
        setMessage("No recipes found. Try a different search term.");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      console.error("Error searching recipes:", error);
      setMessage("Error searching recipes. Please try again.");
      setTimeout(() => setMessage(""), 3000);
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event) => {
    event.preventDefault();
    searchRecipes(searchTerm);
  };

  const handleViewRecipe = (recipe) => {
    setSelectedRecipe(recipe);
    setShowModal(true);
  };

  const handleAddToEvent = (recipe) => {
    setSelectedRecipe(recipe);
    setShowEventModal(true);
  };

  const handleConfirmAddToEvent = async () => {
    if (selectedEvent && selectedRecipe) {
      setAddingToEvent(true);
      try {
        await addRecipeToEvent(Number.parseInt(selectedEvent), selectedRecipe);
        setMessage(`"${selectedRecipe.strMeal}" added to event successfully!`);
        setShowEventModal(false);
        setSelectedEvent("");
        setSelectedRecipe(null);
        setTimeout(() => setMessage(""), 5000);
      } catch (error) {
        console.error("Error adding recipe:", error);
        if (error.response?.status === 409) {
          setMessage("This recipe is already added to this event!");
        } else {
          setMessage("Error adding recipe to event. Please try again.");
        }
        setTimeout(() => setMessage(""), 5000);
      } finally {
        setAddingToEvent(false);
      }
    }
  };

  const getIngredients = (recipe) => {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = recipe[`strIngredient${i}`];
      const measure = recipe[`strMeasure${i}`];
      if (ingredient && ingredient.trim()) {
        ingredients.push(
          `${measure ? measure.trim() + " " : ""}${ingredient.trim()}`
        );
      }
    }
    return ingredients;
  };

  const isRecipeInEvent = (recipe, eventId) => {
    const event = events.find((e) => e.id === eventId);
    return event?.recipes?.some((r) => r.idMeal === recipe.idMeal) || false;
  };

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h1 className="display-5 fw-bold mb-3">Recipe Collection</h1>
          <p className="lead text-muted">
            Discover delicious recipes from around the world and add them to
            your events
          </p>
        </Col>
      </Row>

      {message && (
        <Alert
          variant={
            message.includes("Error") || message.includes("already")
              ? "warning"
              : "success"
          }
          dismissible
          onClose={() => setMessage("")}
        >
          {message}
        </Alert>
      )}

      {/* Search Form */}
      <Row className="mb-4">
        <Col md={8} lg={6}>
          <Form onSubmit={handleSearch}>
            <div className="d-flex gap-2">
              <Form.Control
                type="text"
                placeholder="Search for recipes (e.g., chicken, pasta, dessert)..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? <Spinner animation="border" size="sm" /> : "Search"}
              </Button>
              <Button
                type="button"
                variant="outline-secondary"
                onClick={() => {
                  setSearchTerm("");
                  fetchRandomRecipes();
                }}
                disabled={loading}
              >
                Random
              </Button>
            </div>
          </Form>
        </Col>
      </Row>

      {/* Loading Spinner */}
      {loading && (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Loading delicious recipes...</p>
        </div>
      )}

      {/* Recipe Grid */}
      {!loading && (
        <Row>
          {recipes.length > 0 ? (
            recipes.map((recipe) => (
              <Col md={6} lg={4} key={recipe.idMeal} className="mb-4">
                <Card className="h-100 shadow-sm">
                  <Card.Img
                    variant="top"
                    src={recipe.strMealThumb}
                    alt={recipe.strMeal}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <Card.Body className="d-flex flex-column">
                    <Card.Title className="mb-2" style={{ fontSize: "1.1rem" }}>
                      {recipe.strMeal}
                    </Card.Title>
                    <div className="mb-2">
                      <Badge bg="secondary" className="me-2">
                        {recipe.strCategory}
                      </Badge>
                      <Badge bg="info">{recipe.strArea}</Badge>
                    </div>
                    <Card.Text
                      className="flex-grow-1 text-muted"
                      style={{ fontSize: "0.9rem" }}
                    >
                      {recipe.strInstructions?.substring(0, 120)}...
                    </Card.Text>
                    <div className="d-flex gap-2 mt-auto">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleViewRecipe(recipe)}
                      >
                        View Details
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleAddToEvent(recipe)}
                        disabled={events.length === 0}
                      >
                        Add to Event
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <Col>
              <div className="text-center py-5">
                <div className="mb-4">
                  <span className="display-1">🍽️</span>
                </div>
                <h4>No recipes found</h4>
                <p className="text-muted">
                  Try searching for something else or browse random recipes.
                </p>
                <Button variant="primary" onClick={fetchRandomRecipes}>
                  Load Random Recipes
                </Button>
              </div>
            </Col>
          )}
        </Row>
      )}

      {/* Recipe Detail Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{selectedRecipe?.strMeal}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRecipe && (
            <Row>
              <Col md={6}>
                <img
                  src={selectedRecipe.strMealThumb || ""}
                  alt={selectedRecipe.strMeal}
                  className="img-fluid rounded mb-3"
                />
                <div className="mb-3">
                  <Badge bg="secondary" className="me-2">
                    {selectedRecipe.strCategory}
                  </Badge>
                  <Badge bg="info" className="me-2">
                    {selectedRecipe.strArea}
                  </Badge>
                  {selectedRecipe.strTags && (
                    <Badge bg="success">
                      {selectedRecipe.strTags.split(",")[0]}
                    </Badge>
                  )}
                </div>
              </Col>
              <Col md={6}>
                <h5>Ingredients:</h5>
                <ul className="list-unstyled">
                  {getIngredients(selectedRecipe).map((ingredient, index) => (
                    <li key={index} className="mb-1">
                      • {ingredient}
                    </li>
                  ))}
                </ul>
              </Col>
              <Col xs={12}>
                <h5>Instructions:</h5>
                <p style={{ whiteSpace: "pre-line" }}>
                  {selectedRecipe.strInstructions}
                </p>
                <div className="d-flex gap-2 mt-3">
                  {selectedRecipe.strYoutube && (
                    <Button
                      variant="danger"
                      href={selectedRecipe.strYoutube}
                      target="_blank"
                      size="sm"
                    >
                      📺 Watch Video
                    </Button>
                  )}
                  {selectedRecipe.strSource && (
                    <Button
                      variant="outline-primary"
                      href={selectedRecipe.strSource}
                      target="_blank"
                      size="sm"
                    >
                      🔗 Source
                    </Button>
                  )}
                </div>
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setShowModal(false);
              handleAddToEvent(selectedRecipe);
            }}
            disabled={events.length === 0}
          >
            Add to Event
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add to Event Modal */}
      <Modal show={showEventModal} onHide={() => setShowEventModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Recipe to Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Add "<strong>{selectedRecipe?.strMeal}</strong>" to which event?
          </p>
          <Form.Select
            value={selectedEvent}
            onChange={(event) => setSelectedEvent(event.target.value)}
            disabled={addingToEvent}
          >
            <option value="">Select an event...</option>
            {events.map((event) => (
              <option
                key={event.id}
                value={event.id}
                disabled={
                  selectedRecipe && isRecipeInEvent(selectedRecipe, event.id)
                }
              >
                {event.title} - {new Date(event.date).toLocaleDateString()}
                {selectedRecipe &&
                  isRecipeInEvent(selectedRecipe, event.id) &&
                  " (Already added)"}
              </option>
            ))}
          </Form.Select>
          {events.length === 0 && (
            <Alert variant="info" className="mt-3">
              You don't have any events yet. Create an event first to add
              recipes.
            </Alert>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowEventModal(false)}
            disabled={addingToEvent}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirmAddToEvent}
            disabled={!selectedEvent || addingToEvent}
          >
            {addingToEvent ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Adding...
              </>
            ) : (
              "Add to Event"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
