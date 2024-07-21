int score;

protected override void Initialize()
{
    playerPosition = new Vector2(100, 300); // Initial player position
    playerVelocity = Vector2.Zero;
    obstacles = new List<Obstacle>();
    obstacleSpawnTimer = 0;
    score = 0;  // Initialize score

    base.Initialize();
}

protected override void Update(GameTime gameTime)
{
    var keyboardState = Keyboard.GetState();

    // Move the player
    if (keyboardState.IsKeyDown(Keys.Right))
    {
        playerPosition.X += PlayerSpeed;
    }
    if (keyboardState.IsKeyDown(Keys.Left))
    {
        playerPosition.X -= PlayerSpeed;
    }

    // Jump the player
    if (keyboardState.IsKeyDown(Keys.Space) && !isJumping)
    {
        isJumping = true;
        playerVelocity.Y = PlayerJumpVelocity;
    }

    // Apply gravity
    playerVelocity.Y += Gravity;
    playerPosition.Y += playerVelocity.Y;

    // Check if the player hits the ground
    if (playerPosition.Y >= 300)
    {
        playerPosition.Y = 300;
        playerVelocity.Y = 0;
        isJumping = false;
    }

    // Update obstacles
    obstacleSpawnTimer += (float)gameTime.ElapsedGameTime.TotalSeconds;
    if (obstacleSpawnTimer >= 1f)  // Spawn new obstacles every 1 second
    {
        obstacleSpawnTimer = 0;
        obstacles.Add(new Obstacle
        {
            Texture = obstacleTexture,
            Position = new Vector2(800, 300)  // Position obstacles off-screen to the right
        });
    }

    foreach (var obstacle in obstacles)
    {
        obstacle.Update();
        if (obstacle.Bounds.Intersects(new Rectangle(playerPosition.ToPoint(), new Point(playerTexture.Width, playerTexture.Height))))
        {
            // Handle collision (end game, reduce health, etc.)
            Exit();
        }

        // Increase score based on the distance the player travels
        score++;
    }

    // Remove obstacles that go off-screen
    obstacles.RemoveAll(o => o.Position.X + o.Texture.Width < 0);

    base.Update(gameTime);
}

protected override void Draw(GameTime gameTime)
{
    GraphicsDevice.Clear(Color.CornflowerBlue);

    spriteBatch.Begin();

    // Draw background
    spriteBatch.Draw(backgroundTexture, Vector2.Zero, Color.White);

    // Draw the player
    spriteBatch.Draw(playerTexture, playerPosition, Color.White);

    // Draw obstacles
    foreach (var obstacle in obstacles)
    {
        obstacle.Draw(spriteBatch);
    }

    // Draw the score
    spriteBatch.DrawString(Content.Load<SpriteFont>("font"), $"Score: {score}", new Vector2(10, 10), Color.White);

    spriteBatch.End();

    base.Draw(gameTime);
}
