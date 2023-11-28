package controllers

import scala.swing.Publisher
import scala.swing.event.Event


class ControllerPublisher extends Publisher {
  def push(event: Event): Unit = {
    publish(event)
  }
}
