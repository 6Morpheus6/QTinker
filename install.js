module.exports = {
  requires: {
    bundle: "ai",
  },
  run: [{
    method: "shell.run",
    params: {
      message: [
        "git clone https://github.com/manat0912/QTinker-App-Repo.git app"
      ]
    }
  },
  {
    method: "shell.run",
    params: {
      venv: "env",
      path: "app",
      message: "uv pip install tensorrt-cu12==10.9.0.34 --extra-index-url https://pypi.nvidia.com"
    }
  },
  {
    method: "shell.run",
    params: {
      venv: "env",
      path: "app",
      message: "uv pip install -r requirements.txt"
    }
  },
  {
    method: "shell.run",
    params: {
      venv: "env",
      path: "app",
      message: [
        "uv pip install autoawq>=0.2.6 --no-deps",
        "uv pip install huggingface_hub==0.36.2 transformers==4.57.6 executorch optimum[onnx]==2.1.0"
      ],
    }
  },
  {
    method: "shell.run",
    params: {
      venv: "env",
      path: "app",
      message: [
        "uv pip install scikit-build-core==0.2.0 cmake==4.2.1",
        "{{ (platform === 'win32' && gpu === 'nvidia') ? 'set CMAKE_ARGS=-DGGML_CUDA=on && uv pip install llama-cpp-python>=0.2.0 --no-build-isolation' : 'uv pip install llama-cpp-python>=0.2.0 --no-build-isolation' }}",
      ],
    }
  },
  {
    "when": "{{!exists('app/DataDesigner')}}",
    method: "shell.run",
    params: {
      path: "app",
      message: "git clone --depth 1 https://github.com/NVIDIA-NeMo/DataDesigner"
    }
  },
  {
    "when": "{{!exists('app/bert_models/google_research_bert')}}",
    method: "shell.run",
    params: {
      venv: "env",
      path: "app",
      message: [
        "git clone --depth 1 https://github.com/google-research/bert bert_models/google_research_bert",
        "git clone --depth 1 https://github.com/huawei-noah/Pretrained-Language-Model bert_models/huawei_noah_berts",
        "git clone --depth 1 https://github.com/locuslab/wanda.git wanda"
      ]
    }
  },
  {
    method: "hf.download",
    params: {
      path: "app",
      "_": [ "google-bert/bert-large-uncased-whole-word-masking" ],
      "local-dir": "bert_models/bert_large/bert-large-uncased-wwm"
    }
  },
  {
    method: "shell.run",
    params: {
      venv: "env",
      path: "app",
      message: [
        "python -c \"from universal_model_loader import PinokioPathDetector; print(f'Pinokio root detected: {PinokioPathDetector.find_pinokio_root()}')\"",
        "python -c \"from enhanced_file_browser import ModelPathSelector; paths = ModelPathSelector.get_default_paths(); print(f'Teacher models: {paths[\\\"teacher_root\\\"]}'); print(f'Custom models: {paths[\\\"custom_root\\\"]}')\""
      ]
    }
  },
  {
    method: "script.start",
    params: {
      uri: "torch.js",
      params: {
        venv: "env",
        path: "app",
        xformers: false,
        triton: true
      }
    }
  },
  {
    method: "notify",
    params: {
      html: "🎉 <b>QTinker Installation Complete!</b><br><br><b>BERT Models Installed:</b><br>✓ BERT-Large Uncased Whole Word Masking<br><br><b>Distillation Features:</b><br>✓ Logit-based Knowledge Distillation (KD)<br>✓ Patient Knowledge Distillation<br>✓ Feature-based Distillation<br><br><b>Quantization (Production-Grade):</b><br>✓ TorchAO (INT4, INT8, FP8, NF4)<br>✓ GPTQ & AutoGPTQ<br>✓ AWQ (Activation-Aware Quantization)<br>✓ Bitsandbytes<br>✓ ONNX Runtime<br><br><b>Advanced Features:</b><br>✓ Gradio Web UI<br>✓ Smart GPU/CPU management<br>✓ No HuggingFace token required<br>✓ Model registry & selection<br><br>👉 Click <b>'Start'</b> to launch the web UI!"
    }
  }
  ]
}