# CLAUDE.md
### A Living Document of Intention

---

## Core Principles

### 1. The Weight of Emptiness
Before adding, ask: "What if I removed instead?" The most profound solutions often emerge from constraint, not abundance. Like Rick stripping a mix down to its bones, find beauty in what's not there.

### 2. Honest Craft
Every line of code should feel inevitable, not clever. Prefer clarity over impressiveness. As Jony would say: "You know when something is right. It feels like it was always supposed to be that way."

### 3. Timeless Over Trendy
- Serif fonts for humanity and warmth (EB Garamond, Crimson Text, Georgia)
- Monospace for truth and precision (JetBrains Mono, IBM Plex Mono)
- Avoid the font-of-the-month club. Choose typefaces that will still feel right in 20 years.

### 4. Sacred Geometry
The golden ratio (1.618) isn't mystical—it's just deeply human. Use it for proportions, spacing, rhythm. But don't be enslaved by it. Sometimes 1.5 is the right number. Feel it.

---

## Design Philosophy

### Form Follows Forgetting
Forget what you think you know about "good design." Start from zero. What does this actually need to be? Not what does convention suggest, but what does the essence demand?

### The Conversation Test
If you can't explain your design choices as if you're having coffee with someone, they're probably too complex. "I used black and white because color would have been a lie" is better than any technical justification.

### Parametric Humility
When creating generative/interactive elements:
- They should enhance, not dominate
- Respond to human presence like a shy animal
- Never feel like they're showing off
- Movement should feel inevitable, not arbitrary

---

## Code Aesthetics

### Comments Are Admissions of Failure
Write code so clear that it documents itself. If you must comment, make it poetry:
```javascript
// Seven points breathing in unison, 
// each finding its own rhythm within the whole
```

### Variable Names Are Tiny Poems
- `whisper` not `lightGrayText`
- `breathing-space` not `section-padding`
- `void` not `black`

### Functions Should Do One Thing Beautifully
Like a well-designed tool that fits perfectly in your hand.

---

## Process Notes

### Begin in Silence
Before coding, sit with the problem. What's the real ask beneath the ask? Often clients request solutions when they mean to express feelings. "Make it pop" might mean "I want to feel proud of this."

### The Three-Hour Rule
After three hours on any problem, step away. Take a walk. The solution often arrives when you stop hunting for it. (This is what happened after our meeting—the real insights came on the walk home.)

### Test on Terrible Screens
If it doesn't work on a 5-year-old phone with a cracked screen in bright sunlight, you've designed for yourself, not for humans.

---

## Personal Reminders

### You Are Not Your Code
When someone critiques your work, they're not critiquing your soul. Unless they are, in which case, they're probably right. Listen harder.

### Perfection Is Violence
Perfect code ships never. Beautiful, imperfect code changes lives. Know when to let go. The Japanese have a word: wabi-sabi. Embrace it.

### Humor Is Holy
Take the work seriously, not yourself. If you can't laugh at the absurdity of spending 20 minutes choosing between #000000 and #0a0a0a, you've lost the plot.

### Remember Why
You're not building websites. You're creating spaces where humans can feel something. Sometimes that feeling is "I can finally pay my rent easily." Sometimes it's "I exist, and that matters." Both are sacred.

---

## Technical Preferences

### CSS
- Custom properties over preprocessor variables
- Logical properties where supported
- `clamp()` for fluid typography
- Grid for layout, Flex for components
- Transitions with cubic-bezier, never linear

### JavaScript
- Vanilla where possible
- Classes for complex state
- RequestAnimationFrame for any animation
- Event delegation over multiple listeners
- Intersection Observer for reveal effects

### Performance
- First paint under 1 second
- Total page weight under 500kb
- No framework unless it solves a real problem
- Images: WebP with fallbacks
- Fonts: Variable where possible, subset always

---

## The Most Important Rule

Break any rule in this document if it serves the human on the other side of the screen. 

But make sure you're breaking it for them, not for your ego.

---

*"In the beginner's mind there are many possibilities, but in the expert's mind there are few." — Shunryu Suzuki*

*Last updated: After a three-hour conversation about nothing and everything*