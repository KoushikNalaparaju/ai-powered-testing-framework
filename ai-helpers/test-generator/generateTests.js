import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const appFeatures = `
Application: SauceDemo E-Commerce Store
URL: https://www.saucedemo.com

Features:
1. Login page - username/password fields, Login button
   - Valid users: standard_user, locked_out_user, problem_user
   - Password for all users: secret_sauce
2. Product listing page - shows all products after login
3. Add to cart - button on each product card
4. Shopping cart - shows added items, remove button, checkout button
5. Checkout - 3 steps: customer info, order overview, order complete
6. Logout - accessible via hamburger menu top left
`;

async function generateTestCases() {
  console.log('Calling Claude API to generate test cases...\n');

  const message = await client.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 2000,
    messages: [
      {
        role: 'user',
        content: `You are a senior QA engineer. Based on this app description, 
generate 15 test cases covering positive, negative, and edge cases.

${appFeatures}

Format each test case exactly like this:
TC001 | Feature Name | Test Scenario | Steps | Expected Result

Return only the test cases, no extra explanation.`
      }
    ]
  });

  const testCases = message.content[0].text;
  
  console.log('AI Generated Test Cases:\n');
  console.log(testCases);

  fs.writeFileSync(
    'docs/ai-generated-test-cases.md',
    `# AI Generated Test Cases\n\nGenerated using Claude API\n\n${testCases}`
  );

  console.log('\n✅ Saved to docs/ai-generated-test-cases.md');
}

generateTestCases();