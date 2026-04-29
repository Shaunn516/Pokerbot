# Model and Data Card

## Model Identity

Project model name: StackSensei local poker decision model

Base model described by project material:

- Phi-3 Mini
- Causal language model
- Fine-tuned with LoRA
- LoRA merged into a full model for runtime

Detected Hugging Face config:

```json
{
  "architectures": ["Phi3ForCausalLM"],
  "model_type": "phi3",
  "hidden_size": 3072,
  "num_hidden_layers": 32,
  "num_attention_heads": 32,
  "num_key_value_heads": 32,
  "max_position_embeddings": 4096,
  "sliding_window": 2047,
  "vocab_size": 32064
}
```

## Intended Use

The model is intended to output concise poker actions for 6-handed No Limit Texas Hold'em decisions.

Expected output examples:

- `fold`
- `call`
- `check`
- `bet 18`
- `raise 18`

It is not intended to be a general poker explanation model. In the current architecture, DeepSeek generates explanations and uses the local model action as a recommendation when available.

## Current Availability

The project includes tokenizer and config files but does not include the model weight file.

Present files:

- `config.json`
- `generation_config.json`
- `tokenizer (2).model`
- `tokenizer_config (2).json`
- `added_tokens (2).json`
- `special_tokens_map (2).json`
- `chat_template (2).jinja`

Missing file:

- `model.safetensors`

Without the weight file, `model_loaded` will be false and the backend will skip local 6-max inference.

## Training Data

Dataset format:

```json
[
  {
    "instruction": "Natural-language 6-max poker scenario. Ends with 'Your optimal action is:'",
    "output": "call"
  }
]
```

Dataset files:

| File | Records | Notes |
| --- | ---: | --- |
| `preflop_60k_train_set_prompt_and_label.json` | 63,200 | Preflop action decisions |
| `postflop_500k_train_set_prompt_and_label.json` | 500,000 | Flop/turn/river action decisions |
| `mixed_preflop_postflop_50k_train_set.json` | 50,000 | Mixed subset |

Common scenario template:

- 6-handed NLHE.
- Positions: `UTG`, `HJ`, `CO`, `BTN`, `SB`, `BB`.
- Starting stacks: 100 chips.
- Blinds: 0.5/1.
- Natural language action history.
- Final instruction asks for the optimal action only.

## Runtime Prompt Mismatch

The current backend prompt for the local model is much shorter than the training examples.

Current runtime style:

```text
Game: Hand: Kd Js, Pot: 24, Position: HJ
Question: Should I bet?
Action:
```

Training style:

```text
You are a specialist in playing 6-handed No Limit Texas Holdem...
Here is a game summary:
The small blind is 0.5 chips and the big blind is 1 chips...
Before the flop...
The flop comes...
Now it is your turn to make a move...
Your optimal action is:
```

This mismatch is likely to reduce local model quality. Future work should build runtime prompts that match the training distribution.

## Evaluation Gaps

No evaluation script or metrics were found.

Recommended evaluation:

- Hold out a validation set from preflop and postflop data.
- Measure exact action match.
- Separately measure action class match without sizing.
- Report accuracy by street:
  - preflop,
  - flop,
  - turn,
  - river.
- Report confusion matrix for:
  - fold,
  - check/call,
  - bet/raise.
- Track invalid generations and overlong outputs.

## Deployment Notes

The model is too large for normal GitHub source control. Do not commit `model.safetensors`.

Recommended storage:

- Hugging Face Hub with Git LFS.
- Cloud object storage.
- Deployment platform model volume.

Recommended repo policy:

- Commit tokenizer/config only if license permits.
- Add model download instructions.
- Add checksum for model weights.
- Add `models/README.md`.
- Add `.gitignore` entry for `*.safetensors`, `*.bin`, and large model directories.

