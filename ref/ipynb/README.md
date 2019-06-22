# ipynb 格式

來源 : https://github.com/istar0me/ai107b/blob/master/AI_Project.ipynb

內容:

```
{
  "nbformat": 4,
  "nbformat_minor": 0,
  "metadata": {
    "colab": {
      "name": "AI Project",
      "version": "0.3.2",
      "provenance": [],
      "collapsed_sections": [],
      "include_colab_link": true
    },
    "kernelspec": {
      "name": "python3",
      "display_name": "Python 3"
    },
    "accelerator": "GPU"
  },
  "cells": [
    {
      "cell_type": "markdown",
      "metadata": {
        "id": "view-in-github",
        "colab_type": "text"
      },
      "source": [
        "<a href=\"https://colab.research.google.com/github/istar0me/ai107b/blob/master/AI_Project.ipynb\" target=\"_parent\"><img src=\"https://colab.research.google.com/assets/colab-badge.svg\" alt=\"Open In Colab\"/></a>"
      ]
    },
    {
      "cell_type": "markdown",
      "metadata": {
        "id": "7mGNSRIXmG82",
        "colab_type": "text"
      },
      "source": [
        "# 前言\n",
        "* 以下有四筆資料，不清楚它們之間有什麼關聯，試問當輸入為 38 時輸出為何？\n",
        "* 如果你的回答是 100.4，那恭喜你回答正確，但是答案是怎麼求出來的呢？\n",
        "\n",
        "| -    | 資料1 | 資料2 | 資料3 | 資料4 | 問題  |\n",
        "| ---- | ----- | ----- | ----- | ----- | ----- |\n",
        "| 輸入 | 0     | 8     | 15    | 22    | 38    |\n",
        "| 輸出 | 32    | 46.4  | 59    | 71.6  | **?** |\n",
        "\n",
        "* 聰明的你或許有看出它是溫度轉換的例子。既然如此，可以透過以下的小程式來解題："
      ]
    },
    {
      "cell_type": "code",
      "metadata": {
        "id": "UWfg5z97m6Jk",
        "colab_type": "code",
        "colab": {
          "base_uri": "https://localhost:8080/",
          "height": 34
        },
        "outputId": "91785df2-3580-43f2-e4ce-7af9eefd6cd3"
      },
      "source": [
        "def c2f(celsius):\n",
        "  return 1.8 * celsius + 32\n",
        "\n",
        "print(c2f(38))"
      ],
      "execution_count": 17,
      "outputs": [
        {
          "output_type": "stream",
          "text": [
            "100.4\n"
          ],
          "name": "stdout"
        }
      ]
    },
    {
      "cell_type": "markdown",
      "metadata": {
        "id": "-6a2WRndqOr5",
        "colab_type": "text"
      },
      "source": [
        "* 看起來很簡單對吧？但這是建立在你知道公式（$F = 1.8 \\times C + 32$）的基礎上\n",
        "* 如果你今天不知道他們之間的關聯性，該怎麼得知呢？\n",
        "* 沒錯，這時候就要派機器學習（Machine Learning）上場了，它會根據輸入與輸出找出相對應的演算法（公式）"
      ]
    },
    {
      "cell_type": "markdown",
      "metadata": {
        "id": "0Tb9wAYunT2A",
        "colab_type": "text"
      },
      "source": [
        ""
      ]
    },
    {
      "cell_type": "markdown",
      "metadata": {
        "id": "QoVjcMW6riPG",
        "colab_type": "text"
      },
      "source": [
        "# 期末專案：透過 AI 找出溫度轉換的公式\n",
        "* 程式語言：Python 3\n",
        "* 所需模組：TensorFlow、Numpy、Keras、matplotlib\n",
        "* 搭建環境：Google Colab（基於 Jupyter Notebook 的雲端環境）\n",
        "* 輸　　入：攝氏溫度的資料\n",
        "* 輸　　出：華氏溫度的資料\n",
        "* 預期結果：找出攝氏轉華氏溫度的公式"
      ]
    },
    {
      "cell_type": "markdown",
      "metadata": {
        "id": "n-EiaocI0ioU",
        "colab_type": "text"
      },
      "source": [
        "# 匯入模組\n",
        "* `tensorflow`：機器學習的框架\n",
        "* `numpy`：因為有更強大的科學計算功能，因此用來替代 Python 內建的 List"
      ]
    },
    {
      "cell_type": "code",
      "metadata": {
        "id": "LtTxfDH40ZDo",
        "colab_type": "code",
        "colab": {}
      },
      "source": [
        "import tensorflow as tf\n",
        "tf.logging.set_verbosity(tf.logging.ERROR) # 若有錯誤訊息則列印出來\n",
        "\n",
        "import numpy as np"
      ],
      "execution_count": 0,
      "outputs": []
    },
    {
      "cell_type": "markdown",
      "metadata": {
        "id": "DZM08Iho14ZN",
        "colab_type": "text"
      },
      "source": [
        "# 提供要訓練的資料\n",
        "* 監督式學習是找出輸入與輸出中間的演算法，因此須先提供數據\n",
        "* 這邊 `celsius_q` 的 `q` 代表 question，`fahtrenheit_a` 的 `a` 代表 answer，皆採用 `float` 的型態"
      ]
    },
    {
      "cell_type": "code",
      "metadata": {
        "id": "7EU0XA3k18LO",
        "colab_type": "code",
        "colab": {
          "base_uri": "https://localhost:8080/",
          "height": 136
        },
        "outputId": "70859726-0af6-4910-c6c4-1e1514e98175"
      },
      "source": [
        "celsius_q    = np.array([-40, -10,  0,  8, 15, 22,  38],  dtype=float)\n",
        "fahrenheit_a = np.array([-40,  14, 32, 46, 59, 72, 100],  dtype=float)\n",
        "\n",
        "for i, c in enumerate(celsius_q): # i:index, c:celsius\n",
        "  print(\"{} 攝氏度 = {} 華氏度\".format(c, fahrenheit_a[i]))"
      ],
      "execution_count": 19,
      "outputs": [
        {
          "output_type": "stream",
          "text": [
            "-40.0 攝氏度 = -40.0 華氏度\n",
            "-10.0 攝氏度 = 14.0 華氏度\n",
            "0.0 攝氏度 = 32.0 華氏度\n",
            "8.0 攝氏度 = 46.0 華氏度\n",
            "15.0 攝氏度 = 59.0 華氏度\n",
            "22.0 攝氏度 = 72.0 華氏度\n",
            "38.0 攝氏度 = 100.0 華氏度\n"
          ],
          "name": "stdout"
        }
      ]
    },
    {
      "cell_type": "markdown",
      "metadata": {
        "id": "CxGuETbns8F4",
        "colab_type": "text"
      },
      "source": [
        "### 機器學習術語\n",
        "* Feature（特徵）：模型的輸入，在此為攝氏度\n",
        "* Label（標籤）：模型所預測的輸出，在此為華氏度\n",
        "* Example（範例）：一組訓練時用的輸入與輸出，如 `(0,32)`\n"
      ]
    },
    {
      "cell_type": "markdown",
      "metadata": {
        "id": "q3LHRggi3wfJ",
        "colab_type": "text"
      },
      "source": [
        "# 開始建立模型"
      ]
    },
    {
      "cell_type": "markdown",
      "metadata": {
        "id": "sMYoo6ka_Old",
        "colab_type": "text"
      },
      "source": [
        "* 因為溫度轉換的問題很簡單，只需要用到一層與一個神經元\n",
        "  * `units=1`：此層的神經元數量為 1\n",
        "  * `input_shape=[1]`：此層的輸入為 1 維陣列\n",
        "* Dense Layer = Fully Connected Layer（全連接層）"
      ]
    },
    {
      "cell_type": "code",
      "metadata": {
        "id": "HuWNBNsH3y64",
        "colab_type": "code",
        "colab": {}
      },
      "source": [
        "l0 = tf.keras.layers.Dense(units=1, input_shape=[1])  "
      ],
      "execution_count": 0,
      "outputs": []
    },
    {
      "cell_type": "markdown",
      "metadata": {
        "id": "xvMv9df8SsCg",
        "colab_type": "text"
      },
      "source": [
        "## 組裝層到模型中\n",
        "* 將各層集合至一個 List 中，因為只有一層，因此這邊使用 `[l0]`\n",
        "* 註：若有多層時，會根據前後順序來進行"
      ]
    },
    {
      "cell_type": "code",
      "metadata": {
        "id": "EnvOLkBaeUg5",
        "colab_type": "code",
        "colab": {}
      },
      "source": [
        "model = tf.keras.Sequential([l0])"
      ],
      "execution_count": 0,
      "outputs": []
    },
    {
      "cell_type": "markdown",
      "metadata": {
        "id": "lZGwcaArkYKs",
        "colab_type": "text"
      },
      "source": [
        "## 編譯模型\n",
        "* 在訓練模型前，須先編譯好模型\n",
        "  * loss function（損失函數）：用來算出預測值與正確結果的差距，在此採用 `MSE`（均方誤差）方式\n",
        "  * optimizer（優化器）：盡可能地減少 loss（損失），以更貼近正確的結果，在此採用最常見的 `Adam` 優化器\n",
        "* 關於 `Adam` 優化器：[Gentle Introduction to the Adam Optimization Algorithm for Deep Learning](https://machinelearningmastery.com/adam-optimization-algorithm-for-deep-learning/)\n",
        "* 不同優化器的差異：[[機器學習ML NOTE]SGD, Momentum, AdaGrad, Adam Optimizer](https://medium.com/%E9%9B%9E%E9%9B%9E%E8%88%87%E5%85%94%E5%85%94%E7%9A%84%E5%B7%A5%E7%A8%8B%E4%B8%96%E7%95%8C/%E6%A9%9F%E5%99%A8%E5%AD%B8%E7%BF%92ml-note-sgd-momentum-adagrad-adam-optimizer-f20568c968db)"
      ]
    },
    {
      "cell_type": "code",
      "metadata": {
        "id": "47OpE5h8kXtN",
        "colab_type": "code",
        "colab": {}
      },
      "source": [
        "model.compile(loss='mean_squared_error',\n",
        "              optimizer=tf.keras.optimizers.Adam(0.1))"
      ],
      "execution_count": 0,
      "outputs": []
    },
    {
      "cell_type": "markdown",
      "metadata": {
        "id": "678TUmQkkxcc",
        "colab_type": "text"
      },
      "source": [
        "## 訓練模型\n",
        "* 透過 `.fit` 方法來訓練模型\n",
        "* 分別代入攝氏度、華氏度、訓練幾世與是否列印詳細輸出\n",
        "* epochs（世）代表一組範例要訓練幾世，像上面共有 7 組範例，因此總共訓練 500 * 7 = 3500 次"
      ]
    },
    {
      "cell_type": "code",
      "metadata": {
        "id": "YhyzevRNkzhC",
        "colab_type": "code",
        "colab": {
          "base_uri": "https://localhost:8080/",
          "height": 34
        },
        "outputId": "9e5717f7-54e8-4f8e-a0d0-288317ffd045"
      },
      "source": [
        "history = model.fit(celsius_q, fahrenheit_a, epochs=500, verbose=False)\n",
        "print(\"模型訓練完成\")"
      ],
      "execution_count": 23,
      "outputs": [
        {
          "output_type": "stream",
          "text": [
            "模型訓練完成\n"
          ],
          "name": "stdout"
        }
      ]
    },
    {
      "cell_type": "markdown",
      "metadata": {
        "id": "aq_wBPrdk48c",
        "colab_type": "text"
      },
      "source": [
        "# 顯示訓練的統計資料\n",
        "* 我們透過 `matplotlib` 模組來視覺化資料，x 軸是 Epoch Number（世代數量）、y 軸為Loss Magnitude（損失大小，越小越好）"
      ]
    },
    {
      "cell_type": "code",
      "metadata": {
        "id": "f9vKk_K_k9-P",
        "colab_type": "code",
        "colab": {
          "base_uri": "https://localhost:8080/",
          "height": 300
        },
        "outputId": "7e74144f-7b6b-4966-835e-baa5bd06b5cb"
      },
      "source": [
        "import matplotlib.pyplot as plt\n",
        "plt.xlabel('Epoch Number')\n",
        "plt.ylabel(\"Loss Magnitude\")\n",
        "plt.plot(history.history['loss'])"
      ],
      "execution_count": 24,
      "outputs": [
        {
          "output_type": "execute_result",
          "data": {
            "text/plain": [
              "[<matplotlib.lines.Line2D at 0x7f9fb03558d0>]"
            ]
          },
          "metadata": {
            "tags": []
          },
          "execution_count": 24
        },
        {
          "output_type": "display_data",
          "data": {
            "image/png": "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\n",
            "text/plain": [
              "<Figure size 432x288 with 1 Axes>"
            ]
          },
          "metadata": {
            "tags": []
          }
        }
      ]
    },
    {
      "cell_type": "markdown",
      "metadata": {
        "id": "qztKyRVv27LP",
        "colab_type": "text"
      },
      "source": [
        "# 使用模型來預測\n",
        "* 現在可以使用已經建立好的模型來預測，只需要代入攝氏溫度（在此設定為 `100.0`）"
      ]
    },
    {
      "cell_type": "code",
      "metadata": {
        "id": "xP9nO4Z6xW1h",
        "colab_type": "code",
        "colab": {
          "base_uri": "https://localhost:8080/",
          "height": 34
        },
        "outputId": "119498fa-bb0f-4d41-a30a-7ee1c877540c"
      },
      "source": [
        "print(model.predict([100.0]))"
      ],
      "execution_count": 25,
      "outputs": [
        {
          "output_type": "stream",
          "text": [
            "[[211.33719]]\n"
          ],
          "name": "stdout"
        }
      ]
    },
    {
      "cell_type": "markdown",
      "metadata": {
        "id": "ZUxyxbQp3K1-",
        "colab_type": "text"
      },
      "source": [
        "* 正確答案為 $100 \\times 1.8 + 32 = 212$，可以看出此模型的表現非常優異"
      ]
    },
    {
      "cell_type": "markdown",
      "metadata": {
        "id": "lSf8ypKE38Ws",
        "colab_type": "text"
      },
      "source": [
        "# 查看此層的權重與偏差\n",
        "* 在經過 500 世的計算後，預測的權重（weight）為 1.8206435，可看出與實際的結果 1.8 相當接近\n",
        "* 至於偏差（bias）預測為 29.27282，雖誤差較大，但也跟實際結果 32 很接近"
      ]
    },
    {
      "cell_type": "code",
      "metadata": {
        "id": "wRIxrXnHxZJX",
        "colab_type": "code",
        "colab": {
          "base_uri": "https://localhost:8080/",
          "height": 34
        },
        "outputId": "340036f0-a6a3-44a3-dbc4-3d734b340b92"
      },
      "source": [
        "print(\"此層的變數： {}\".format(l0.get_weights()))"
      ],
      "execution_count": 27,
      "outputs": [
        {
          "output_type": "stream",
          "text": [
            "此層的變數： [array([[1.8206435]], dtype=float32), array([29.27282], dtype=float32)]\n"
          ],
          "name": "stdout"
        }
      ]
    }
  ]
}
```


