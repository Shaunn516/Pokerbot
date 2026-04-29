# Models

Model weights are not committed to this repository.

The original StackSensei demo referenced a fine-tuned Phi-3 Mini model for 6-max poker action selection, but the public MVP is DeepSeek-only and does not require `model.safetensors` or a local model directory.

Future hosted-model work should:

- Store weights outside GitHub, such as Hugging Face Hub, object storage, or a model-serving platform.
- Keep `ENABLE_LOCAL_MODEL=false` for the public MVP until hosted inference is implemented.
- Add checksums and download instructions if any model artifacts are published.

