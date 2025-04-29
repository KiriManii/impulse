// Don't generate IDs here - these are templates that will get unique IDs when used
export const defaultFunnels = [
    {
      name: 'Simple Product Page',
      steps: [
        {
          name: 'Landing Page',
          type: 'landing',
          friction: 3,
          abandonmentTriggers: [
            {
              type: 'ux',
              probability: 0.1,
              impactedBy: ['patience', 'techSavviness']
            },
            {
              type: 'distraction',
              probability: 0.15,
              impactedBy: ['distractionProne']
            }
          ]
        },
        {
          name: 'Product Details',
          type: 'product',
          friction: 2,
          abandonmentTriggers: [
            {
              type: 'price',
              probability: 0.25,
              impactedBy: ['budget']
            },
            {
              type: 'trust',
              probability: 0.1,
              impactedBy: ['mood']
            }
          ]
        },
        {
          name: 'Add to Cart',
          type: 'cart',
          friction: 1,
          abandonmentTriggers: [
            {
              type: 'technical',
              probability: 0.05,
              impactedBy: ['techSavviness']
            }
          ]
        },
        {
          name: 'Checkout',
          type: 'checkout',
          friction: 5,
          abandonmentTriggers: [
            {
              type: 'ux',
              probability: 0.2,
              impactedBy: ['patience']
            },
            {
              type: 'price',
              probability: 0.3,
              impactedBy: ['budget']
            },
            {
              type: 'technical',
              probability: 0.1,
              impactedBy: ['techSavviness']
            }
          ]
        },
        {
          name: 'Confirmation',
          type: 'confirmation',
          friction: 1,
          abandonmentTriggers: []
        }
      ]
    }
  ];