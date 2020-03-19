<Container>
<Row>
  <Col xs><Input></Input></Col>
  <Col xs></Col>
  <Col xs style={{textAlign:"right"}}><Input></Input></Col>
</Row>
<Row>
  <ToggleButtonGroup size="large" value={this.state.rating} exclusive onChange={this.handleRating}>
    <ToggleButton key={1} value="1">1</ToggleButton>
    <ToggleButton key={2} value="2">2</ToggleButton>
    <ToggleButton key={3} value="3">3</ToggleButton>
    <ToggleButton key={4} value="4">4</ToggleButton>
    <ToggleButton key={5} value="5">5</ToggleButton>
    <ToggleButton key={6} value="6">6</ToggleButton>
    <ToggleButton key={7} value="7">7</ToggleButton>
    <ToggleButton key={8} value="8">8</ToggleButton>
    <ToggleButton key={9} value="9">9</ToggleButton>
    <ToggleButton key={10} value="10">10</ToggleButton>
  </ToggleButtonGroup>
</Row>
</Container>
